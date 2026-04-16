import { put } from '@vercel/blob'
import { createClient } from '@/lib/supabase/server'

/**
 * Storage routing: Vercel Blob (edge CDN) vs Supabase Storage.
 *
 * - 'blob': Vercel Blob — edge-cached, fast global delivery. Use for frequently accessed
 *   images (avatars, content cards, logos). Requires BLOB_READ_WRITE_TOKEN.
 * - 'supabase': Supabase Storage — cheaper, RLS-compatible. Use for infrequent access,
 *   private files, or when Blob is not configured.
 *
 * If 'blob' is requested but BLOB_READ_WRITE_TOKEN is missing, falls back to Supabase.
 */
export type StorageTarget = 'blob' | 'supabase'

interface UploadOptions {
  /** Where to store: 'blob' (edge CDN) or 'supabase' (storage bucket). Default: 'blob' with supabase fallback. */
  storage?: StorageTarget
  /** File path within the storage (e.g. 'avatars/user-id/avatar.webp') */
  path: string
  /** Supabase Storage bucket name. Required if storage is 'supabase'. Default: 'uploads' */
  bucket?: string
  /** Content type of the file */
  contentType: string
  /** Whether the file should be publicly accessible. Default: true */
  public?: boolean
  /** Whether to overwrite existing files at the same path. Default: true */
  upsert?: boolean
}

interface UploadResult {
  url: string
  storage: StorageTarget
}

const hasBlobToken = () => !!process.env.BLOB_READ_WRITE_TOKEN

/**
 * Upload a file to the best available storage.
 * Server-side only — call from API routes or server actions.
 *
 * @example
 * // Auto-routes to Blob if configured, Supabase otherwise
 * const { url } = await uploadFile(buffer, { path: 'avatars/123/avatar.webp', contentType: 'image/webp' })
 *
 * // Force Supabase Storage (private bucket, RLS)
 * const { url } = await uploadFile(buffer, { storage: 'supabase', bucket: 'documents', path: 'user/doc.pdf', contentType: 'application/pdf', public: false })
 */
export async function uploadFile(
  body: Buffer | ReadableStream | Blob,
  options: UploadOptions,
): Promise<UploadResult> {
  const {
    storage = 'blob',
    path,
    bucket = 'uploads',
    contentType,
    public: isPublic = true,
    upsert = true,
  } = options

  // Route to Blob if requested and available
  if (storage === 'blob' && hasBlobToken()) {
    const blob = await put(path, body, {
      access: isPublic ? 'public' : 'no-random-suffix' as 'public',
      addRandomSuffix: false,
      contentType,
      allowOverwrite: upsert,
    })
    return { url: blob.url, storage: 'blob' }
  }

  // Supabase Storage (fallback or explicit)
  const supabase = await createClient()
  const fileBody = body instanceof Buffer
    ? body
    : body instanceof Blob
      ? Buffer.from(await body.arrayBuffer())
      : await streamToBuffer(body as ReadableStream)

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, fileBody, {
      upsert,
      contentType,
    })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)

  if (isPublic) {
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
    return { url: publicUrl, storage: 'supabase' }
  }

  // Signed URL for private files (1 hour)
  const { data, error: signError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600)

  if (signError || !data) throw new Error(`Failed to create signed URL: ${signError?.message}`)
  return { url: data.signedUrl, storage: 'supabase' }
}

/**
 * Check if Vercel Blob is configured and available.
 */
export function isBlobAvailable(): boolean {
  return hasBlobToken()
}

async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let done = false
  while (!done) {
    const result = await reader.read()
    done = result.done
    if (result.value) chunks.push(result.value)
  }
  return Buffer.concat(chunks)
}
