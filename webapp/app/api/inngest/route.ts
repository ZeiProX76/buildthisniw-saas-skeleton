import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { functions } from "@/lib/inngest/functions";

if (process.env.NODE_ENV === 'production' && !process.env.INNGEST_SIGNING_KEY) {
  throw new Error('INNGEST_SIGNING_KEY is required in production')
}

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
