import { compressImage, validateImageFile } from './compress-image'

type CompressResult =
  | { success: true; file: File }
  | { success: false; error: string }

type ValidateResult =
  | { valid: true }
  | { valid: false; error: string }

/**
 * Compress an avatar image to WebP, max 512x512, ~500KB.
 * Thin wrapper around compressImage with the 'avatar' preset.
 */
export async function compressAvatarImage(file: File): Promise<CompressResult> {
  return compressImage(file, 'avatar')
}

/**
 * Validate avatar file type.
 */
export function validateAvatarFile(file: File): ValidateResult {
  return validateImageFile(file)
}
