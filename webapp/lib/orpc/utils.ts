/** Escape PostgREST metacharacters in user search input */
export function sanitizeSearchInput(input: string): string {
  return input.replace(/[%_,.*()\\]/g, (char) => `\\${char}`)
}
