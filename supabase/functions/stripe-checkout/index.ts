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

    // 2. Parse + validate input
    const body = await req.json();
    const { priceId, mode, successUrl, cancelUrl, quantity, kitSlug } = body as {
      priceId: string;
      mode: "subscription" | "payment";
      successUrl: string;
      cancelUrl: string;
      quantity?: number;
      kitSlug?: string;
    };

    if (!priceId || !mode || !successUrl || !cancelUrl) {
      return jsonResponse(
        req,
        { error: "Missing required fields: priceId, mode, successUrl, cancelUrl" },
        400,
      );
    }

    if (mode !== "subscription" && mode !== "payment") {
      return jsonResponse(
        req,
        { error: 'Invalid mode. Must be "subscription" or "payment"' },
        400,
      );
    }

    // Validate redirect URLs against allowed domain
    if (!validateAppUrl(successUrl) || !validateAppUrl(cancelUrl)) {
      return jsonResponse(req, { error: "Invalid redirect URL" }, 400);
    }

    // Validate quantity bounds
    if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 1 || quantity > 100)) {
      return jsonResponse(req, { error: "Invalid quantity" }, 400);
    }

    // 3. Find or create Stripe customer
    //    Use _stripe_resolve_customer_id RPC first (instant, no lag).
    //    Stripe Search is eventually consistent (~1min lag) which caused
    //    duplicate customers when users clicked checkout multiple times.
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return jsonResponse(req, { error: "Stripe not configured" }, 500);
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-09-30.clover" });

    // First try: query synced stripe.customers table via Supabase (instant, no lag)
    const { data: resolvedCustomer } = await supabase.rpc(
      "_stripe_resolve_customer_id",
      { p_user_id: user.id },
    );

    let customerId: string | null = resolvedCustomer ?? null;

    // Fallback: if not in DB yet (brand new user), search Stripe directly
    if (!customerId) {
      const existing = await stripe.customers.search({
        query: `metadata["user_id"]:"${user.id}"`,
        limit: 1,
      });

      if (existing.data[0]) {
        customerId = existing.data[0].id;
      }
    }

    // Last resort: create a new customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
    }

    // 4. Create checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode,
      line_items: [{ price: priceId, quantity: quantity ?? 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { user_id: user.id, ...(kitSlug ? { kit_slug: kitSlug } : {}) },
    };

    if (mode === "subscription") {
      sessionParams.subscription_data = {
        metadata: { user_id: user.id },
      };
    } else {
      sessionParams.payment_intent_data = {
        metadata: { user_id: user.id, ...(kitSlug ? { kit_slug: kitSlug } : {}) },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return jsonResponse(req, { url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("stripe-checkout error:", message);
    return jsonResponse(req, { error: "Internal error" }, 500);
  }
});
