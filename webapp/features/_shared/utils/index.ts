/**
 * Shared utilities for features
 * @module features/_shared/utils
 */

export { compressImage, validateImageFile, IMAGE_PRESETS } from './compress-image'
export type { ImagePreset, ImagePresetName } from './compress-image'
export { compressAvatarImage, validateAvatarFile } from './compress-avatar'

/**
 * Validate redirect URL to prevent open redirect attacks
 * Only allows relative paths starting with /
 *
 * @param redirect - The redirect URL to validate
 * @returns The validated redirect path or undefined if invalid
 *
 * @example
 * validateRedirect('/dashboard') // '/dashboard'
 * validateRedirect('//evil.com') // undefined
 * validateRedirect('https://evil.com') // undefined
 */
export function validateRedirect(
  redirect: string | undefined,
): string | undefined {
  if (!redirect) return undefined;

  // Decode to catch encoded open redirect bypasses (e.g. /%2F%2Fevil.com)
  let decoded = redirect;
  try {
    decoded = decodeURIComponent(redirect);
  } catch {
    return undefined;
  }

  // Must start with / and not start with // or \ (backslash tricks)
  if (
    !decoded.startsWith("/") ||
    decoded.startsWith("//") ||
    decoded.startsWith("/\\")
  ) {
    return undefined;
  }

  // Block protocol injections
  const lower = decoded.toLowerCase();
  if (lower.includes("javascript:") || lower.includes("data:")) {
    return undefined;
  }

  // Return original (not decoded) to preserve intent
  return redirect;
}
