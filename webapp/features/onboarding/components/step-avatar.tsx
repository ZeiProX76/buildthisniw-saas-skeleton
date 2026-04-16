'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useSaveAvatar } from '../hooks'
import { AVATAR_ACCEPT } from '../constants'
import { compressAvatarImage } from '@/features/_shared/utils'
import type { StepAvatarProps } from '../types'

/**
 * Step 2: Avatar upload
 * Allows user to upload a profile photo or skip
 */
export function StepAvatar({ currentAvatarUrl, onComplete }: StepAvatarProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const saveAvatar = useSaveAvatar()

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setIsUploading(true)

    try {
      // Compress to WebP 512x512 ~500KB
      const result = await compressAvatarImage(file)
      if (!result.success) {
        setError(result.error)
        setIsUploading(false)
        return
      }
      const compressed = result.file

      // Show preview from compressed file
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(compressed)

      const supabase = createClient()
      const { data: claimsData } = await supabase.auth.getClaims()
      const userId = claimsData?.claims?.sub as string | undefined
      if (!userId) throw new Error('Not authenticated')

      const fileName = `${userId}/avatar.webp`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, compressed, {
          upsert: true,
          contentType: 'image/webp',
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      await saveAvatar.mutateAsync(publicUrl)
      onComplete(publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar')
      setPreview(currentAvatarUrl || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSkip = () => {
    onComplete(null)
  }

  const handleContinue = () => {
    if (preview && !isUploading) {
      onComplete(preview)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">
        Add a photo
      </h1>

      <div className="space-y-6">
        {/* Avatar upload zone */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="relative w-32 h-32 rounded-full border-2 border-dashed border-muted-foreground/50 hover:border-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Upload avatar"
          >
            {preview ? (
              <img
                src={preview}
                alt="Avatar preview"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-xs">Upload</span>
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 rounded-full bg-background/80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            )}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={AVATAR_ACCEPT}
          onChange={handleFileSelect}
          className="hidden"
          aria-hidden="true"
        />

        {error && (
          <p className="text-sm text-destructive text-center">
            {error}
          </p>
        )}

        <p className="text-xs text-muted-foreground text-center">
          JPG, PNG, WebP, or HEIC · auto-compressed
        </p>

        {/* Action buttons */}
        <div className="flex flex-col space-y-3">
          {preview && (
            <Button
              onClick={handleContinue}
              size="lg"
              className="w-full"
              disabled={isUploading}
            >
              Continue
            </Button>
          )}
          <Button
            onClick={handleSkip}
            variant="ghost"
            size="lg"
            className="w-full"
            disabled={isUploading}
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  )
}