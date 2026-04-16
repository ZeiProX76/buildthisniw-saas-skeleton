import { NextResponse } from "next/server";
import { execFileSync } from "child_process";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CheckStatus = "pass" | "fail" | "warn" | "unchecked";

interface Check {
  id: string;
  label: string;
  group: string;
  status: CheckStatus;
  message?: string;
  hint?: string;
  dashboardUrl?: string;
}

interface SystemCheck {
  id: string;
  label: string;
  required: boolean;
  status: CheckStatus;
  version?: string;
  message?: string;
  hint?: string;
}

interface CheckResponse {
  system: SystemCheck[];
  checks: Check[];
  summary: {
    total: number;
    passing: number;
    failing: number;
    warnings: number;
  };
}

// ---------------------------------------------------------------------------
// Dashboard URLs
// ---------------------------------------------------------------------------

const DASHBOARD_URLS = {
  supabase: "https://supabase.com/dashboard/project/_/settings/api",
  stripe: "https://dashboard.stripe.com/test/apikeys",
  resend: "https://resend.com/api-keys",
  turnstile: "https://dash.cloudflare.com/?to=/:account/turnstile",
  sentry: "https://sentry.io/settings/auth-tokens/",
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

const TURNSTILE_TEST_KEYS = new Set([
  "1x00000000000000000000AA",
  "2x00000000000000000000AB",
  "3x00000000000000000000FF",
]);

// ---------------------------------------------------------------------------
// Individual check runners
// ---------------------------------------------------------------------------

function checkSupabaseUrl(): Check {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const base: Pick<Check, "id" | "label" | "group" | "dashboardUrl"> = {
    id: "supabase-url",
    label: "Supabase URL",
    group: "supabase",
    dashboardUrl: DASHBOARD_URLS.supabase,
  };

  if (!value) {
    return {
      ...base,
      status: "fail",
      message: "NEXT_PUBLIC_SUPABASE_URL is not set.",
      hint: "Copy the URL from your Supabase project settings.",
    };
  }

  if (!isValidUrl(value)) {
    return {
      ...base,
      status: "fail",
      message: "Not a valid URL.",
      hint: "Should look like https://abcdefgh.supabase.co",
    };
  }

  return { ...base, status: "pass", message: "Valid URL format." };
}

function checkSupabaseKey(): Check {
  const value = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const base: Pick<Check, "id" | "label" | "group" | "dashboardUrl"> = {
    id: "supabase-key",
    label: "Supabase Publishable Key",
    group: "supabase",
    dashboardUrl: DASHBOARD_URLS.supabase,
  };

  if (!value) {
    return {
      ...base,
      status: "fail",
      message: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set.",
      hint: "Copy the anon/public key from your Supabase project settings.",
    };
  }

  if (!value.startsWith("sb_")) {
    return {
      ...base,
      status: "warn",
      message: "Key doesn't start with 'sb_' - verify it's the anon (public) key.",
    };
  }

  return { ...base, status: "pass", message: "Valid key format." };
}

function checkStripeSecret(): Check {
  const value = process.env.STRIPE_SECRET_KEY;
  const base: Pick<Check, "id" | "label" | "group" | "dashboardUrl"> = {
    id: "stripe-secret",
    label: "Stripe Secret Key",
    group: "stripe",
    dashboardUrl: DASHBOARD_URLS.stripe,
  };

  if (!value) {
    return {
      ...base,
      status: "fail",
      message: "STRIPE_SECRET_KEY is not set.",
      hint: "Get your secret key from the Stripe dashboard.",
    };
  }

  if (!value.startsWith("sk_test_") && !value.startsWith("sk_live_")) {
    return {
      ...base,
      status: "fail",
      message: "Should start with 'sk_test_' or 'sk_live_'.",
      hint: "Make sure you copied the secret key, not the publishable key.",
    };
  }

  return { ...base, status: "pass", message: "Valid key format." };
}

function checkStripePublic(): Check {
  const value = process.env.STRIPE_PUBLISHABLE_KEY;
  const base: Pick<Check, "id" | "label" | "group" | "dashboardUrl"> = {
    id: "stripe-public",
    label: "Stripe Publishable Key",
    group: "stripe",
    dashboardUrl: DASHBOARD_URLS.stripe,
  };

  if (!value) {
    return {
      ...base,
      status: "fail",
      message: "STRIPE_PUBLISHABLE_KEY is not set.",
      hint: "Get your publishable key from the Stripe dashboard.",
    };
  }

  if (!value.startsWith("pk_test_") && !value.startsWith("pk_live_")) {
    return {
      ...base,
      status: "fail",
      message: "Should start with 'pk_test_' or 'pk_live_'.",
    };
  }

  return { ...base, status: "pass", message: "Valid key format." };
}

function checkResend(): Check {
  const value = process.env.RESEND_API_KEY;
  const base: Pick<Check, "id" | "label" | "group" | "dashboardUrl"> = {
    id: "resend",
    label: "Resend API Key",
    group: "resend",
    dashboardUrl: DASHBOARD_URLS.resend,
  };

  if (!value) {
    return {
      ...base,
      status: "fail",
      message: "RESEND_API_KEY is not set.",
      hint: "Get your API key from the Resend dashboard.",
    };
  }

  if (!value.startsWith("re_")) {
    return {
      ...base,
      status: "fail",
      message: "Should start with 're_'.",
      hint: "Make sure you copied the full API key from Resend.",
    };
  }

  return { ...base, status: "pass", message: "Valid key format." };
}

function checkTurnstile(): Check {
  const value = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const base: Pick<Check, "id" | "label" | "group" | "dashboardUrl"> = {
    id: "turnstile",
    label: "Turnstile Site Key",
    group: "turnstile",
    dashboardUrl: DASHBOARD_URLS.turnstile,
  };

  if (!value) {
    return {
      ...base,
      status: "warn",
      message: "Not set. Bot protection won't work.",
      hint: "Optional for development. Use a test key: 1x00000000000000000000AA",
    };
  }

  if (TURNSTILE_TEST_KEYS.has(value)) {
    return {
      ...base,
      status: "warn",
      message: "Using a Cloudflare test key. Fine for dev, replace for production.",
    };
  }

  return { ...base, status: "pass", message: "Site key is set." };
}

function checkSentry(): Check {
  const value = process.env.SENTRY_AUTH_TOKEN;
  const base: Pick<Check, "id" | "label" | "group" | "dashboardUrl"> = {
    id: "sentry",
    label: "Sentry Auth Token",
    group: "sentry",
    dashboardUrl: DASHBOARD_URLS.sentry,
  };

  if (!value) {
    return {
      ...base,
      status: "warn",
      message: "Not set. Source maps won't upload to Sentry.",
      hint: "Optional for development. Get a token from Sentry settings.",
    };
  }

  if (!value.startsWith("sntrys_")) {
    return {
      ...base,
      status: "warn",
      message: "Token format looks unusual. Verify it's correct.",
    };
  }

  return { ...base, status: "pass", message: "Valid token format." };
}

// ---------------------------------------------------------------------------
// System requirements checks
// ---------------------------------------------------------------------------

function getCommandVersion(bin: string, args: string[]): string | null {
  try {
    return execFileSync(bin, args, { encoding: "utf-8", timeout: 5000 }).trim();
  } catch {
    return null;
  }
}

function parseMajorVersion(raw: string): number {
  const match = raw.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function checkSystemRequirements(): SystemCheck[] {
  const checks: SystemCheck[] = [];

  const nodeRaw = getCommandVersion("node", ["--version"]);
  if (nodeRaw) {
    const major = parseMajorVersion(nodeRaw);
    checks.push({
      id: "node",
      label: "Node.js",
      required: true,
      status: major >= 20 ? "pass" : "fail",
      version: nodeRaw.replace("v", ""),
      message: major >= 20 ? `v${nodeRaw.replace("v", "")}` : `v${nodeRaw.replace("v", "")} (need >= 20)`,
      hint: major < 20 ? "Download from https://nodejs.org" : undefined,
    });
  } else {
    checks.push({
      id: "node",
      label: "Node.js",
      required: true,
      status: "fail",
      message: "Not found",
      hint: "Download from https://nodejs.org",
    });
  }

  const npmRaw = getCommandVersion("npm", ["--version"]);
  if (npmRaw) {
    const major = parseMajorVersion(npmRaw);
    checks.push({
      id: "npm",
      label: "npm",
      required: true,
      status: major >= 9 ? "pass" : "fail",
      version: npmRaw,
      message: major >= 9 ? `v${npmRaw}` : `v${npmRaw} (need >= 9)`,
      hint: major < 9 ? "Update with: npm install -g npm@latest" : undefined,
    });
  } else {
    checks.push({
      id: "npm",
      label: "npm",
      required: true,
      status: "fail",
      message: "Not found",
      hint: "Comes with Node.js",
    });
  }

  const gitRaw = getCommandVersion("git", ["--version"]);
  if (gitRaw) {
    const major = parseMajorVersion(gitRaw);
    checks.push({
      id: "git",
      label: "git",
      required: true,
      status: major >= 2 ? "pass" : "fail",
      version: gitRaw.replace("git version ", ""),
      message: major >= 2 ? gitRaw.replace("git version ", "") : `${gitRaw} (need >= 2)`,
      hint: major < 2 ? "Download from https://git-scm.com" : undefined,
    });
  } else {
    checks.push({
      id: "git",
      label: "git",
      required: true,
      status: "fail",
      message: "Not found",
      hint: "Download from https://git-scm.com",
    });
  }

  return checks;
}

// ---------------------------------------------------------------------------
// Supabase live connection test
// ---------------------------------------------------------------------------

async function testSupabaseConnection(
  urlCheck: Check,
  keyCheck: Check
): Promise<{ urlCheck: Check; keyCheck: Check }> {
  if (urlCheck.status !== "pass" || keyCheck.status !== "pass") {
    return { urlCheck, keyCheck };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { urlCheck, keyCheck };
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      method: "GET",
      headers: { apikey: supabaseKey },
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      return {
        urlCheck: {
          ...urlCheck,
          status: "pass",
          message: "Connected to Supabase.",
        },
        keyCheck: {
          ...keyCheck,
          status: "pass",
          message: "Key accepted by Supabase.",
        },
      };
    }

    return {
      urlCheck: {
        ...urlCheck,
        status: "fail",
        message: `Supabase returned HTTP ${response.status}.`,
        hint: "Check that your project is not paused and the URL is correct.",
      },
      keyCheck: {
        ...keyCheck,
        status: "warn",
        message: "Could not verify key.",
      },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return {
      urlCheck: {
        ...urlCheck,
        status: "fail",
        message: `Connection failed: ${msg}`,
        hint: "Check that your Supabase project is running.",
      },
      keyCheck: {
        ...keyCheck,
        status: "unchecked",
        message: "Skipped - Supabase URL connection failed.",
      },
    };
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(): Promise<
  NextResponse<CheckResponse | { error: string }>
> {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in development." },
      { status: 403 }
    );
  }

  // Run system requirements checks
  const system = checkSystemRequirements();

  // Run format checks
  let supabaseUrlCheck = checkSupabaseUrl();
  let supabaseKeyCheck = checkSupabaseKey();
  const stripeSecretCheck = checkStripeSecret();
  const stripePublicCheck = checkStripePublic();
  const resendCheck = checkResend();
  const turnstileCheck = checkTurnstile();
  const sentryCheck = checkSentry();

  // Run Supabase live connection test
  const supabaseResult = await testSupabaseConnection(
    supabaseUrlCheck,
    supabaseKeyCheck
  );
  supabaseUrlCheck = supabaseResult.urlCheck;
  supabaseKeyCheck = supabaseResult.keyCheck;

  const checks: Check[] = [
    supabaseUrlCheck,
    supabaseKeyCheck,
    stripeSecretCheck,
    stripePublicCheck,
    resendCheck,
    turnstileCheck,
    sentryCheck,
  ];

  const summary = {
    total: checks.length,
    passing: checks.filter((c) => c.status === "pass").length,
    failing: checks.filter((c) => c.status === "fail").length,
    warnings: checks.filter((c) => c.status === "warn").length,
  };

  return NextResponse.json({ system, checks, summary });
}
