import { EmailTemplate, TemplateVariables, EmailData, User } from './types.ts';

// Brand Colors (extracted from globals.css - OKLCH converted to hex for email compatibility)
// Light mode color scheme: Blue hues (220-230 OKLCH)
const BRAND_COLORS = {
  // Primary brand colors - BLUE (not orange!)
  primary: '#5B7FDB',        // oklch(0.63 0.05 230) - Soft blue
  primaryForeground: '#FFFFFF', // White

  // Secondary colors
  secondary: '#DFE2E8',      // oklch(0.88 0.01 220) - Very light blue-gray
  secondaryForeground: '#3D4451', // Dark text on secondary

  // Status colors
  destructive: '#DC2626',    // oklch(0.6368 0.2078 25.3313) - Red for errors
  destructiveForeground: '#FFFFFF',

  // Neutral colors
  background: '#FAFBFC',     // oklch(0.9800 0.0020 220.0000) - Very light background
  foreground: '#1A1F29',     // oklch(0.1000 0.0100 220.0000) - Dark text
  muted: '#F1F3F5',         // oklch(0.9400 0.0050 220.0000) - Light gray
  mutedForeground: '#6E7681', // oklch(0.5000 0.0150 220.0000) - Medium gray
  border: '#DDE0E4',        // oklch(0.8800 0.0080 220.0000) - Border gray

  // Success color
  success: '#059669',       // Green for positive actions
  successForeground: '#FFFFFF'
};

// Clean, professional email template base
const getBaseTemplate = (variables: TemplateVariables, content: string): string => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${variables.companyName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND_COLORS.muted}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 0; text-align: center;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;">

          <!-- Logo Section (Outside Card) -->
          <tr>
            <td style="text-align: center; padding-bottom: 32px;">
              <div style="font-size: 24px; font-weight: 700; color: ${BRAND_COLORS.primary};">
                ${variables.companyName}
              </div>
            </td>
          </tr>

          <!-- Main Content Card -->
          <tr>
            <td style="background-color: ${BRAND_COLORS.background}; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); padding: 48px 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 0; text-align: center;">
              <p style="color: ${BRAND_COLORS.mutedForeground}; font-size: 12px; margin: 0; line-height: 16px;">
                © ${variables.year} ${variables.companyName}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

// Email content templates
const emailContents = {
  signup: (variables: TemplateVariables) => `
    <div style="text-align: center;">
      <!-- Title -->
      <h1 style="color: ${BRAND_COLORS.foreground}; font-size: 24px; font-weight: 600; margin: 0 0 16px; line-height: 1.3;">
        Verify your email address
      </h1>

      <!-- Simple description -->
      <p style="color: ${BRAND_COLORS.mutedForeground}; font-size: 16px; line-height: 24px; margin: 0 0 40px;">
        Enter this code to complete your registration:
      </p>

      <!-- Clean OTP Display -->
      <div style="padding: 40px 24px; background-color: ${BRAND_COLORS.muted}; border-radius: 16px; margin-bottom: 32px;">
        <div style="font-family: 'Monaco', 'Menlo', monospace; font-size: 48px; font-weight: 800; color: ${BRAND_COLORS.primary}; letter-spacing: 12px; margin: 0;">
          ${variables.token}
        </div>
      </div>

      <!-- Simple expiration notice -->
      <p style="color: ${BRAND_COLORS.mutedForeground}; font-size: 14px; margin: 0; line-height: 20px;">
        This code expires in <strong>10 minutes</strong>
      </p>
    </div>
  `,

  recovery: (variables: TemplateVariables) => `
    <div style="text-align: center;">
      <h1 style="color: ${BRAND_COLORS.foreground}; font-size: 24px; font-weight: 600; margin: 0 0 16px; line-height: 1.3;">
        Reset Your Password
      </h1>
      <p style="color: ${BRAND_COLORS.mutedForeground}; font-size: 16px; line-height: 24px; margin: 0 0 32px;">
        We received a request to reset your password. Click the button below to create a new password.
      </p>

      <!-- CTA Button -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 32px;">
        <tr>
          <td style="text-align: center;">
            <a href="${variables.confirmationUrl}" style="display: inline-block; background-color: ${BRAND_COLORS.primary}; color: ${BRAND_COLORS.primaryForeground}; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 32px; border-radius: 8px; min-width: 200px;">
              Reset Password
            </a>
          </td>
        </tr>
      </table>

      <p style="color: ${BRAND_COLORS.mutedForeground}; font-size: 14px; margin: 0 0 8px; line-height: 20px;">
        This link expires in <strong>10 minutes</strong>.
      </p>
      <p style="color: ${BRAND_COLORS.mutedForeground}; font-size: 14px; margin: 0; line-height: 20px;">
        If you didn't request this password reset, you can safely ignore this email.
      </p>
    </div>
  `,

  magiclink: (variables: TemplateVariables) => `
    <div style="text-align: center;">
      <h1 style="color: ${BRAND_COLORS.foreground}; font-size: 24px; font-weight: 600; margin: 0 0 16px; line-height: 1.3;">
        Your Magic Link ✨
      </h1>
      <p style="color: ${BRAND_COLORS.mutedForeground}; font-size: 16px; line-height: 24px; margin: 0 0 32px;">
        Click the button below to securely sign in. No password required!
      </p>

      <!-- CTA Button -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 32px;">
        <tr>
          <td style="text-align: center;">
            <a href="${variables.confirmationUrl}" style="display: inline-block; background-color: ${BRAND_COLORS.success}; color: ${BRAND_COLORS.successForeground}; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 32px; border-radius: 8px; min-width: 200px;">
              Sign In
            </a>
          </td>
        </tr>
      </table>

      <!-- Alternative verification -->
      <div style="padding: 24px; background-color: #F0FDF4; border-radius: 8px; border: 1px solid #BBF7D0;">
        <p style="color: #166534; font-size: 14px; margin: 0 0 8px; font-weight: 500;">
          Or enter this sign-in code:
        </p>
        <div style="font-family: 'Monaco', 'Menlo', monospace; font-size: 24px; font-weight: 700; color: ${BRAND_COLORS.success}; letter-spacing: 4px;">
          ${variables.token}
        </div>
      </div>
    </div>
  `,

  invite: (variables: TemplateVariables) => `
    <div style="text-align: center;">
      <h1 style="color: ${BRAND_COLORS.foreground}; font-size: 24px; font-weight: 600; margin: 0 0 16px; line-height: 1.3;">
        You're Invited!
      </h1>
      <p style="color: ${BRAND_COLORS.mutedForeground}; font-size: 16px; line-height: 24px; margin: 0 0 32px;">
        You've been invited to join us. Accept the invitation to get started.
      </p>

      <!-- CTA Button -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 32px;">
        <tr>
          <td style="text-align: center;">
            <a href="${variables.confirmationUrl}" style="display: inline-block; background-color: ${BRAND_COLORS.secondary}; color: ${BRAND_COLORS.secondaryForeground}; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 32px; border-radius: 8px; min-width: 200px;">
              Accept Invitation
            </a>
          </td>
        </tr>
      </table>

      <!-- Alternative verification -->
      <div style="padding: 24px; background-color: #EFF6FF; border-radius: 8px; border: 1px solid #DBEAFE;">
        <p style="color: #1E40AF; font-size: 14px; margin: 0 0 8px; font-weight: 500;">
          Or enter this invitation code:
        </p>
        <div style="font-family: 'Monaco', 'Menlo', monospace; font-size: 24px; font-weight: 700; color: ${BRAND_COLORS.secondary}; letter-spacing: 4px;">
          ${variables.token}
        </div>
      </div>
    </div>
  `,

  email_change: (variables: TemplateVariables) => `
    <div style="text-align: center;">
      <h1 style="color: ${BRAND_COLORS.foreground}; font-size: 24px; font-weight: 600; margin: 0 0 16px; line-height: 1.3;">
        Confirm Email Change 📧
      </h1>
      <p style="color: ${BRAND_COLORS.mutedForeground}; font-size: 16px; line-height: 24px; margin: 0 0 8px;">
        We received a request to change your email address from:
      </p>
      <p style="color: ${BRAND_COLORS.mutedForeground}; font-size: 14px; margin: 0 0 8px;"><strong>${variables.email}</strong></p>
      <p style="color: ${BRAND_COLORS.mutedForeground}; font-size: 16px; line-height: 24px; margin: 0 0 32px;">
        to: <strong style="color: ${BRAND_COLORS.primary};">${variables.newEmail || 'new email'}</strong>
      </p>

      <!-- CTA Button -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 32px;">
        <tr>
          <td style="text-align: center;">
            <a href="${variables.confirmationUrl}" style="display: inline-block; background-color: ${BRAND_COLORS.primary}; color: ${BRAND_COLORS.primaryForeground}; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 32px; border-radius: 8px; min-width: 200px;">
              Confirm Email Change
            </a>
          </td>
        </tr>
      </table>

      <!-- Alternative verification -->
      <div style="padding: 24px; background-color: #FFFBEB; border-radius: 8px; border: 1px solid #FDE68A;">
        <p style="color: #92400E; font-size: 14px; margin: 0 0 8px; font-weight: 500;">
          Or enter these verification codes:
        </p>
        <div style="display: flex; justify-content: center; gap: 16px; align-items: center;">
          <div>
            <div style="font-size: 12px; color: ${BRAND_COLORS.mutedForeground}; margin-bottom: 4px;">Current Email</div>
            <div style="font-family: 'Monaco', 'Menlo', monospace; font-size: 18px; font-weight: 700; color: ${BRAND_COLORS.primary}; letter-spacing: 2px;">
              ${variables.token}
            </div>
          </div>
          <div style="color: ${BRAND_COLORS.mutedForeground}; font-size: 20px;">+</div>
          <div>
            <div style="font-size: 12px; color: ${BRAND_COLORS.mutedForeground}; margin-bottom: 4px;">New Email</div>
            <div style="font-family: 'Monaco', 'Menlo', monospace; font-size: 18px; font-weight: 700; color: ${BRAND_COLORS.primary}; letter-spacing: 2px;">
              ${variables.newToken || '------'}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  email_change_new: (variables: TemplateVariables) => `
    <div style="text-align: center;">
      <h1 style="color: ${BRAND_COLORS.foreground}; font-size: 24px; font-weight: 600; margin: 0 0 16px; line-height: 1.3;">
        Verify New Email Address 📧
      </h1>
      <p style="color: ${BRAND_COLORS.mutedForeground}; font-size: 16px; line-height: 24px; margin: 0 0 32px;">
        Please confirm this new email address for your account: <strong style="color: ${BRAND_COLORS.primary};">${variables.email}</strong>
      </p>

      <!-- CTA Button -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 32px;">
        <tr>
          <td style="text-align: center;">
            <a href="${variables.confirmationUrl}" style="display: inline-block; background-color: ${BRAND_COLORS.primary}; color: ${BRAND_COLORS.primaryForeground}; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 32px; border-radius: 8px; min-width: 200px;">
              Verify New Email
            </a>
          </td>
        </tr>
      </table>

      <!-- Alternative verification -->
      <div style="padding: 24px; background-color: ${BRAND_COLORS.muted}; border-radius: 8px; border: 1px solid ${BRAND_COLORS.border};">
        <p style="color: ${BRAND_COLORS.mutedForeground}; font-size: 14px; margin: 0 0 8px; font-weight: 500;">
          Or enter this verification code:
        </p>
        <div style="font-family: 'Monaco', 'Menlo', monospace; font-size: 24px; font-weight: 700; color: ${BRAND_COLORS.primary}; letter-spacing: 4px;">
          ${variables.newToken || variables.token}
        </div>
      </div>
    </div>
  `,

  reauthentication: (variables: TemplateVariables) => `
    <div style="text-align: center;">
      <h1 style="color: ${BRAND_COLORS.foreground}; font-size: 24px; font-weight: 600; margin: 0 0 16px; line-height: 1.3;">
        Confirm Your Identity 🔒
      </h1>
      <p style="color: ${BRAND_COLORS.mutedForeground}; font-size: 16px; line-height: 24px; margin: 0 0 32px;">
        For your security, please confirm your identity by entering the verification code below.
      </p>

      <!-- Alternative verification -->
      <div style="padding: 24px; background-color: #FFFBEB; border-radius: 8px; border: 1px solid #FDE68A;">
        <p style="color: #92400E; font-size: 14px; margin: 0 0 8px; font-weight: 500;">
          Enter this verification code:
        </p>
        <div style="font-family: 'Monaco', 'Menlo', monospace; font-size: 24px; font-weight: 700; color: ${BRAND_COLORS.primary}; letter-spacing: 4px;">
          ${variables.token}
        </div>
      </div>

      <p style="color: ${BRAND_COLORS.mutedForeground}; font-size: 14px; margin: 24px 0 0; line-height: 20px;">
        This code will expire in 10 minutes for your security.
      </p>
    </div>
  `
};

// Generate confirmation URL
function generateConfirmationURL(emailData: EmailData): string {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  if (!supabaseUrl) throw new Error('SUPABASE_URL not set');
  const baseUrl = `${supabaseUrl}/auth/v1/verify`;
  const params = new URLSearchParams({
    token: emailData.token_hash,
    type: emailData.email_action_type,
    redirect_to: emailData.redirect_to
  });
  return `${baseUrl}?${params.toString()}`;
}

// Generate email template
export function generateEmailTemplate(emailData: EmailData, user: User): EmailTemplate {
  const variables: TemplateVariables = {
    confirmationUrl: generateConfirmationURL(emailData),
    token: emailData.token,
    newToken: emailData.token_new,
    siteUrl: emailData.site_url,
    email: user.email,
    newEmail: emailData.new_email,
    companyName: Deno.env.get('APP_NAME') || 'Your App',
    year: new Date().getFullYear().toString()
  };

  const actionType = emailData.email_action_type;
  const contentGenerator = emailContents[actionType];

  if (!contentGenerator) {
    throw new Error(`Unsupported email action type: ${actionType}`);
  }

  const content = contentGenerator(variables);
  const html = getBaseTemplate(variables, content);

  // Generate text version (simplified)
  const textContent = {
    signup: `Verify Your Email\n\nPlease verify your email address with this code: ${variables.token}\n\nThis code expires in 10 minutes.\n\n© ${variables.year} ${variables.companyName}. All rights reserved.`,
    recovery: `Reset Your Password\n\nWe received a request to reset your password. Use this link to create a new password: ${variables.confirmationUrl}\n\nThis link expires in 10 minutes. If you didn't request this, you can ignore this email.\n\n© ${variables.year} ${variables.companyName}.`,
    magiclink: `Your Sign-In Link\n\nClick this link to securely sign in: ${variables.confirmationUrl}\n\nOr enter this sign-in code: ${variables.token}\n\n© ${variables.year} ${variables.companyName}.`,
    invite: `You're Invited!\n\nYou've been invited to join ${variables.companyName}. Accept the invitation: ${variables.confirmationUrl}\n\nOr enter this invitation code: ${variables.token}\n\n© ${variables.year} ${variables.companyName}.`,
    email_change: `Confirm Email Change\n\nWe received a request to change your email from ${variables.email} to ${variables.newEmail}.\n\nConfirm the change: ${variables.confirmationUrl}\n\nOr enter these codes: ${variables.token} and ${variables.newToken}\n\n© ${variables.year} ${variables.companyName}.`,
    email_change_new: `Verify New Email Address\n\nPlease confirm this new email address for your account: ${variables.email}\n\nVerify: ${variables.confirmationUrl}\n\nOr enter this code: ${variables.newToken || variables.token}\n\n© ${variables.year} ${variables.companyName}.`,
    reauthentication: `Confirm Your Identity\n\nFor your security, please confirm your identity by entering this verification code: ${variables.token}\n\nThis code expires in 10 minutes.\n\n© ${variables.year} ${variables.companyName}.`
  };

  const subjects = {
    signup: 'Verify Your Email',
    recovery: 'Reset Your Password',
    magiclink: 'Your Sign-In Link',
    invite: 'You\'re Invited!',
    email_change: 'Confirm Your Email Change',
    email_change_new: 'Verify Your New Email Address',
    reauthentication: 'Confirm Your Identity'
  };

  return {
    subject: subjects[actionType],
    html,
    text: textContent[actionType]
  };
}