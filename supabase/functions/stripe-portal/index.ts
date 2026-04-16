import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@17?target=deno";

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const siteUrl = Deno.env.get("SITE_URL") || "";
  const allowedOrigin = origin && siteUrl && origin === siteUrl ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function validateAppUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const siteUrl = Deno.env.get("SITE_URL") || "";
    if (!siteUrl) return false;
    const allowed = new URL(siteUrl);
    return parsed.host === allowed.host && (parsed.protocol === "https:" || parsed.protocol === "http:");
  } catch {
    return false;
  }
}

function jsonResponse(req: Request, body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  if (req.method !== "POST") {
    return jsonResponse(req, { error: "Method not allowed" }, 405);
  }

  try {
    // 1. Verify JWT → get user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse(req, { error: "Missing authorization header" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return jsonResponse(req, { error: "Unauthorized" }, 401);
    }

    // 2. Parse input
    const body = await req.json();
    const { returnUrl } = body as { returnUrl: string };

    if (!returnUrl) {
      return jsonResponse(req, { error: "Missing required field: returnUrl" }, 400);
    }

    // Validate redirect URL against allowed domain
    if (!validateAppUrl(returnUrl)) {
      return jsonResponse(req, { error: "Invalid redirect URL" }, 400);
    }

    // 3. Find Stripe customer
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return jsonResponse(req, { error: "Stripe not configured" }, 500);
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-09-30.clover" });

    const existing = await stripe.customers.search({
      query: `metadata["user_id"]:"${user.id}"`,
      limit: 1,
    });

    if (!existing.data[0]) {
      return jsonResponse(
        req,
        { error: "No billing account found. Please subscribe first." },
        404,
      );
    }

    // 4. Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: existing.data[0].id,
      return_url: returnUrl,
    });

    return jsonResponse(req, { url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("stripe-portal error:", message);
    return jsonResponse(req, { error: "Internal error" }, 500);
  }
});
