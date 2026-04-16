import imageCompression from 'browser-image-compression'

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

type CompressResult =
  | { success: true; file: File }
  | { success: false; error: string }

type ValidateResult =
  | { valid: true }
  | { valid: false; error: string }

export interface ImagePreset {
  maxSizeMB: number
  maxWidthOrHeight: number
  fileType: 'image/webp' | 'image/jpeg' | 'image/png'
  quality: number
}

/**
 * Built-in presets for common use cases.
 * Every image upload in the app MUST use one of these (or a custom preset).
 * This ensures browser-side compression + WebP conversion + sanitization.
 */
export const IMAGE_PRESETS = {
  /** 512x512, ~500KB — profile photos, small thumbnails */
  avatar: {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 512,
    fileType: 'image/webp' as const,
    quality: 0.95,
  },
  /** 1920x1080, ~2MB — hero images, banners, cover photos */
  cover: {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    fileType: 'image/webp' as const,
    quality: 0.9,
  },
  /** 800x800, ~1MB — content images, cards, gallery items */
  content: {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
    fileType: 'image/webp' as const,
    quality: 0.9,
  },
  /** 200x200, ~100KB — icons, small logos, favicons */
  thumbnail: {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 200,
    fileType: 'image/webp' as const,
    quality: 0.85,
  },
} satisfies Record<string, ImagePreset>

export type ImagePresetName = keyof typeof IMAGE_PRESETS

/**
 * Compress any image using a preset or custom config.
 * Runs in a Web Worker when available (non-blocking).
 *
 * Security: converts to target format (strips EXIF, metadata, embedded scripts).
 * Performance: resizes + compresses before upload (saves bandwidth + storage).
 *
 * @example
 * // Using a built-in preset
 * const result = await compressImage(file, 'avatar')
 *
 * // Using a custom preset
 * const result = await compressImage(file, { maxSizeMB: 3, maxWidthOrHeight: 2560, fileType: 'image/webp', quality: 0.85 })
 */
export async function compressImage(
  file: File,
  preset: ImagePresetName | ImagePreset,
): Promise<CompressResult> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { success: false, error: 'Please select a JPG, PNG, WebP, or HEIC image' }
  }

  const config = typeof preset === 'string' ? IMAGE_PRESETS[preset] : preset

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: config.maxSizeMB,
      maxWidthOrHeight: config.maxWidthOrHeight,
      fileType: config.fileType,
      initialQuality: config.quality,
      useWebWorker: true,
    })

    const ext = config.fileType.split('/')[1]
    const newName = file.name.replace(/\.[^.]+$/, `.${ext}`)

    const outputFile = new File([compressed], newName, { type: config.fileType })

    return { success: true, file: outputFile }
  } catch {
    return { success: false, error: 'Failed to compress image. Please try another file.' }
  }
}

/**
 * Validate file type before compression.
 */
export function validateImageFile(file: File): ValidateResult {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Please select a JPG, PNG, WebP, or HEIC image' }
  }
  return { valid: true }
}
