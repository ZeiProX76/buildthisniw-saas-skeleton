'use client'

import { useState, useCallback } from 'react'
import { compressImage, type ImagePresetName, type ImagePreset } from '../utils/compress-image'
import type { StorageTarget } from '@/lib/storage'

interface UploadImageOptions {
  /** Compression preset or custom config */
  preset: ImagePresetName | ImagePreset
  /** Storage path builder — receives userId, returns the path (e.g. 'avatars/{userId}/avatar.webp') */
  path: string | ((userId: string) => string)
  /** 'blob' (edge CDN, default) or 'supabase' */
  storage?: StorageTarget
  /** Supabase bucket name (only used when storage is 'supabase') */
  bucket?: string
}

interface UploadState {
  isUploading: boolean
  error: string | null
  progress: 'idle' | 'compressing' | 'uploading' | 'done'
}

interface UploadResult {
  url: string
  storage: StorageTarget
}

/**
 * Client hook: compress + upload an image in one call.
 *
 * Compresses in a Web Worker (non-blocking), then uploads to the best
 * available storage (Vercel Blob → Supabase Storage fallback).
 *
 * @example
 * const { upload, isUploading, error } = useUploadImage({
 *   preset: 'avatar',
 *   path: (userId) => `avatars/${userId}/avatar.webp`,
 * })
 *
 * const handleFile = async (file: File) => {
 *   const result = await upload(file)
 *   if (result) saveToDb(result.url)
 * }
 */
export function useUploadImage(options: UploadImageOptions) {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    error: null,
    progress: 'idle',
  })

  const upload = useCallback(async (file: File): Promise<UploadResult | null> => {
    setState({ isUploading: true, error: null, progress: 'compressing' })

    // Step 1: Compress in browser
    const compressed = await compressImage(file, options.preset)
    if (!compressed.success) {
      setState({ isUploading: false, error: compressed.error, progress: 'idle' })
      return null
    }

    setState(prev => ({ ...prev, progress: 'uploading' }))

    // Step 2: Upload to server
    try {
      const pathStr = typeof options.path === 'function'
        ? options.path(await getUserId())
        : options.path

      const params = new URLSearchParams({
        path: pathStr,
        contentType: compressed.file.type,
        storage: options.storage ?? 'blob',
      })
      if (options.bucket) params.set('bucket', options.bucket)

      const res = await fetch(`/api/upload?${params}`, {
        method: 'POST',
        body: compressed.file,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(data.error ?? `Upload failed (${res.status})`)
      }

      const result: UploadResult = await res.json()
      setState({ isUploading: false, error: null, progress: 'done' })
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setState({ isUploading: false, error: message, progress: 'idle' })
      return null
    }
  }, [options])

  return {
    upload,
    ...state,
  }
}

async function getUserId(): Promise<string> {
  // Lightweight: read from supabase client session
  const { createClient } = await import('@/lib/supabase/client')
  const supabase = createClient()
  const { data } = await supabase.auth.getClaims()
  const userId = data?.claims?.sub as string | undefined
  if (!userId) throw new Error('Not authenticated')
  return userId
}
