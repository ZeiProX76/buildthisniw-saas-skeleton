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
    const { priceId } = body as { priceId: string };

    if (!priceId || typeof priceId !== "string" || priceId.length > 100) {
      return jsonResponse(req, { error: "Missing or invalid priceId" }, 400);
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

    const customerId = existing.data[0].id;

    // 4. Find active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (!subscriptions.data[0]) {
      return jsonResponse(
        req,
        { error: "No active subscription found to upgrade." },
        404,
      );
    }

    const subscription = subscriptions.data[0];
    const itemId = subscription.items.data[0]?.id;

    if (!itemId) {
      return jsonResponse(
        req,
        { error: "No subscription item found." },
        500,
      );
    }

    // 5. Upgrade in-place with proration
    await stripe.subscriptions.update(subscription.id, {
      items: [{ id: itemId, price: priceId }],
      proration_behavior: "create_prorations",
    });

    return jsonResponse(req, { success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("stripe-upgrade error:", message);
    return jsonResponse(req, { error: "Internal error" }, 500);
  }
});
