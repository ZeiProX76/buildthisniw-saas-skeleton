# TOPR Custom Email Authentication System

This Edge Function implements a custom Send Email Hook for Supabase Auth using Resend API to deliver beautiful, branded authentication emails.

## Features

- 🎨 **Beautiful Templates**: Modern, responsive email templates for all auth actions
- 🔐 **Secure**: Uses Standard Webhooks for payload verification
- 📧 **Complete Coverage**: Supports signup, recovery, magic link, invites, email changes, and reauthentication
- 💪 **Robust**: Built-in retry logic and comprehensive error handling
- 🚀 **Fast**: Optimized for performance with minimal dependencies
- 📱 **Responsive**: Mobile-friendly email templates

## Email Types Supported

1. **Signup** - Welcome new users with verification
2. **Recovery** - Password reset emails
3. **Magic Link** - Passwordless authentication
4. **Invite** - User invitations
5. **Email Change** - Confirm email address changes
6. **Email Change New** - Verify new email addresses
7. **Reauthentication** - Security verification

## Setup Instructions

### 1. Deploy the Edge Function
```bash
supabase functions deploy send-email --no-verify-jwt
```

### 2. Set Environment Variables
```bash
# Set your Resend API key
supabase secrets set RESEND_API_KEY=your_resend_api_key_here

# Generate and set webhook secret (see step 3)
supabase secrets set SEND_EMAIL_HOOK_SECRET=v1,whsec_your_base64_secret_here
```

### 3. Configure Supabase Auth Hook

1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Hooks**
3. Create a new **Send Email** hook
4. Set the hook URL to: `https://your-project-ref.supabase.co/functions/v1/send-email`
5. Generate a webhook secret and copy it
6. Set the secret as `SEND_EMAIL_HOOK_SECRET` environment variable

### 4. Verify Domain in Resend

1. Go to your Resend Dashboard
2. Add and verify the domain `topr.io`
3. Ensure the `onboarding` subdomain is configured

### 5. Test the Integration

Try signing up a new user to test the email delivery:

```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'password123'
});
```

## Project Structure

```
send-email/
├── index.ts          # Main Edge Function handler
├── types.ts          # TypeScript type definitions
├── templates.ts      # Email template system
└── README.md         # This file
```

## Configuration

The function uses these environment variables:

- `RESEND_API_KEY`: Your Resend API key for sending emails
- `SEND_EMAIL_HOOK_SECRET`: Webhook secret for payload verification

## Template Customization

To customize email templates, edit the `templates.ts` file. Each email type has:

- **HTML Template**: Rich, responsive HTML with inline CSS
- **Text Template**: Plain text fallback
- **Subject**: Dynamic subject line

## Error Handling

The function includes comprehensive error handling:

- **Webhook Verification**: Validates payload integrity
- **Retry Logic**: Automatic retries for transient failures
- **Rate Limiting**: Respects Resend rate limits
- **Logging**: Detailed error logging for debugging

## Monitoring

Monitor email delivery in:

1. **Supabase Dashboard**: Function logs and metrics
2. **Resend Dashboard**: Email delivery status and analytics
3. **Browser Console**: Client-side error messages

## Troubleshooting

### Common Issues

1. **Webhook signature verification fails**
   - Check that `SEND_EMAIL_HOOK_SECRET` is correctly set
   - Ensure the secret format is `v1,whsec_...`

2. **Resend API errors**
   - Verify `RESEND_API_KEY` is valid
   - Check domain verification in Resend dashboard
   - Ensure you're not hitting rate limits

3. **Template rendering errors**
   - Check email_data fields in webhook payload
   - Verify email action type is supported
   - Look for missing template variables

### Debug Mode

Enable debug logging by checking the Supabase Function logs:

```bash
supabase functions logs send-email
```

## Security

- Uses Standard Webhooks specification for payload verification
- Webhook secrets are automatically generated and rotated
- All API keys are stored as encrypted environment variables
- CORS headers are properly configured
- Input validation and sanitization

## Performance

- Minimal dependencies for fast cold starts
- Efficient template rendering
- Automatic retry with exponential backoff
- Proper error codes for Supabase retry logic