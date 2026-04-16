import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { uploadFile, type StorageTarget } from '@/lib/storage'

const MAX_UPLOAD_SIZE = 4.5 * 1024 * 1024 // 4.5MB (Vercel body limit)

/**
 * POST /api/upload
 *
 * Authenticated image upload route. Accepts compressed images from the client,
 * routes to Vercel Blob (if configured) or Supabase Storage.
 *
 * Query params:
 * - path: storage path (e.g. 'avatars/user-id/avatar.webp') — REQUIRED
 * - bucket: Supabase bucket name (default: 'uploads') — only for supabase storage
 * - storage: 'blob' | 'supabase' (default: 'blob' with fallback)
 * - contentType: MIME type (default: 'image/webp')
 *
 * Body: raw file bytes (from client-side compressImage)
 *
 * Returns: { url: string, storage: 'blob' | 'supabase' }
 */
export async function POST(request: Request): Promise<NextResponse> {
  // Auth check
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub as string | undefined

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Validate body
  if (!request.body) {
    return NextResponse.json({ error: 'No file body' }, { status: 400 })
  }

  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > MAX_UPLOAD_SIZE) {
    return NextResponse.json({ error: 'File too large. Max 4.5MB.' }, { status: 413 })
  }

  // Parse params
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const bucket = searchParams.get('bucket') ?? 'uploads'
  const storage = (searchParams.get('storage') ?? 'blob') as StorageTarget
  const contentType = searchParams.get('contentType') ?? 'image/webp'

  if (!path) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 })
  }

  // Security: prevent path traversal
  if (path.includes('..') || path.startsWith('/')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  // Security: ensure path is scoped to the authenticated user's directory
  if (!path.startsWith(`${userId}/`)) {
    return NextResponse.json({ error: 'Unauthorized path' }, { status: 403 })
  }

  try {
    const body = await request.arrayBuffer()
    const result = await uploadFile(Buffer.from(body), {
      storage,
      path,
      bucket,
      contentType,
      public: true,
      upsert: true,
    })

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
