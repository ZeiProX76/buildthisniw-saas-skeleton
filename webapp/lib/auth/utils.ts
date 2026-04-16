/**
 * JWT claim readers — zero DB queries.
 * Claims are injected by public.custom_access_token_hook.
 */

export function getAvatarUrl(claims: Record<string, unknown>): string {
  return typeof claims.avatar_url === "string" ? claims.avatar_url : "";
}

export function getPlan(claims: Record<string, unknown>): string {
  return typeof claims.plan === "string" ? claims.plan : "free";
}

export function getName(claims: Record<string, unknown>): string {
  return typeof claims.name === "string" ? claims.name : "";
}

export function getEmail(claims: Record<string, unknown>): string {
  return typeof claims.email === "string" ? claims.email : "";
}

export function hasBuilderPlan(claims: Record<string, unknown>): boolean {
  return getPlan(claims) === "framework";
}
