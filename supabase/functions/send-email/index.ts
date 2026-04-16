import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { WebhookPayload } from './types.ts';
import { generateEmailTemplate } from './templates.ts';

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const siteUrl = Deno.env.get('SITE_URL') || '';
  const allowedOrigin = origin && siteUrl && origin === siteUrl ? origin : '';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, webhook-id, webhook-timestamp, webhook-signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET')?.replace('v1,whsec_', '');

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'Email service configuration error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!hookSecret) {
      console.error('SEND_EMAIL_HOOK_SECRET not found');
      return new Response(
        JSON.stringify({ error: 'Webhook configuration error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get request payload and headers
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);

    // Verify webhook signature
    const wh = new Webhook(hookSecret);
    let webhookData: WebhookPayload;

    try {
      webhookData = wh.verify(payload, headers) as WebhookPayload;
    } catch (error) {
      console.error('Webhook verification failed:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid webhook signature' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { user, email_data } = webhookData;

    console.log(`Processing email for action: ${email_data.email_action_type}, user: ${user.email}`);

    // Skip sending signup confirmation emails for invited users
    // These users have already been auto-confirmed via Admin API
    if (email_data.email_action_type === 'signup' && user.user_metadata?.invited_user === true) {
      console.log(`Skipping signup confirmation email for invited user: ${user.email}`);
      return new Response(
        JSON.stringify({
          success: true,
          skipped: true,
          reason: 'Invited user - email already confirmed',
          action: email_data.email_action_type
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate email template
    let emailTemplate;
    try {
      emailTemplate = generateEmailTemplate(email_data, user);
    } catch (error) {
      console.error('Template generation failed:', error);
      return new Response(
        JSON.stringify({ error: 'Email template generation failed' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Send email using Resend API
    const resendResponse = await sendEmailWithResend(
      resendApiKey,
      user.email,
      emailTemplate.subject,
      emailTemplate.html,
      emailTemplate.text
    );

    if (!resendResponse.success) {
      console.error('Resend API error:', resendResponse.error);

      // Return appropriate error status based on error type
      const statusCode = resendResponse.statusCode || 500;
      const shouldRetry = statusCode >= 500 || statusCode === 429;

      return new Response(
        JSON.stringify({
          error: 'Failed to send email',
          details: resendResponse.error,
          retry: shouldRetry
        }),
        {
          status: statusCode,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': shouldRetry ? '60' : undefined
          }
        }
      );
    }

    console.log(`Email sent successfully: ${resendResponse.emailId}`);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        emailId: resendResponse.emailId,
        action: email_data.email_action_type
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Send email using Resend API with retry logic
async function sendEmailWithResend(
  apiKey: string,
  to: string,
  subject: string,
  html: string,
  text: string,
  maxRetries: number = 3
): Promise<{ success: boolean; emailId?: string; error?: string; statusCode?: number }> {

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: Deno.env.get('EMAIL_FROM') || 'Build Kit <onboarding@resend.dev>',
          to: [to],
          subject,
          html,
          text
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          emailId: responseData.id
        };
      }

      // Handle different error scenarios
      const statusCode = response.status;
      const errorMessage = responseData.message || 'Unknown error';

      console.error(`Resend API error (attempt ${attempt}):`, {
        status: statusCode,
        error: errorMessage,
        details: responseData
      });

      // Don't retry validation errors or authentication errors
      if (statusCode === 400 || statusCode === 401 || statusCode === 403) {
        return {
          success: false,
          error: errorMessage,
          statusCode
        };
      }

      // Retry on server errors or rate limits
      if ((statusCode >= 500 || statusCode === 429) && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff, max 10s
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return {
        success: false,
        error: errorMessage,
        statusCode
      };

    } catch (networkError) {
      console.error(`Network error (attempt ${attempt}):`, networkError);

      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        console.log(`Retrying after network error in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return {
        success: false,
        error: 'Network error occurred',
        statusCode: 500
      };
    }
  }

  return {
    success: false,
    error: 'Max retries exceeded',
    statusCode: 500
  };
}