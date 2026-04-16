export interface EmailData {
  token: string;
  token_hash: string;
  redirect_to: string;
  email_action_type: 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change' | 'email_change_new' | 'reauthentication';
  site_url: string;
  token_new: string;
  token_hash_new: string;
  email?: string;
  new_email?: string;
}

export interface User {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

export interface WebhookPayload {
  user: User;
  email_data: EmailData;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface TemplateVariables {
  confirmationUrl: string;
  token: string;
  newToken?: string;
  siteUrl: string;
  email: string;
  newEmail?: string;
  companyName: string;
  year: string;
}