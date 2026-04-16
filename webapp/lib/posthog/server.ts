import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

function getPostHogServer(): PostHog | null {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return null;
  if (!posthogClient) {
    posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogClient;
}

export async function trackServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
) {
  const posthog = getPostHogServer();
  if (!posthog) return;
  posthog.capture({ distinctId, event, properties });
  await posthog.flush();
}

export async function identifyServerUser(
  distinctId: string,
  properties: Record<string, unknown>,
) {
  const posthog = getPostHogServer();
  if (!posthog) return;
  posthog.identify({ distinctId, properties });
  await posthog.flush();
}
