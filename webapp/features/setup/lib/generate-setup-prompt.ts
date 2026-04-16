export interface ServiceSelection {
  supabase: boolean // always true
  stripe: boolean
  sentry: boolean
  inngest: boolean
  resend: boolean
  turnstile: boolean
  context7: boolean
}

export const DEFAULT_SELECTIONS: ServiceSelection = {
  supabase: true,
  stripe: true,
  sentry: true,
  inngest: true,
  resend: true,
  turnstile: true,
  context7: true,
}

const MCP_COMMANDS: { key: keyof ServiceSelection; cmd: string; comment?: string }[] = [
  {
    key: 'supabase',
    cmd: 'claude mcp add --transport http supabase https://mcp.supabase.com/mcp',
  },
  {
    key: 'sentry',
    cmd: 'claude mcp add --transport http sentry https://mcp.sentry.dev/mcp',
  },
  {
    key: 'context7',
    cmd: 'claude mcp add context7 -- npx -y @upstash/context7-mcp',
  },
  {
    key: 'stripe',
    cmd: '# claude mcp add stripe -- npx -y @stripe/mcp --api-key=$STRIPE_SECRET_KEY',
    comment: 'Run this after you have your Stripe secret key from the setup process.',
  },
]

export function generateMcpCommands(selections: ServiceSelection): string {
  return MCP_COMMANDS.filter((m) => selections[m.key])
    .map((m) => (m.comment ? `${m.cmd}\n# ${m.comment}` : m.cmd))
    .join('\n\n')
}

export function generateSetupPrompt(selections: ServiceSelection): string {
  const services = (Object.keys(selections) as (keyof ServiceSelection)[])
    .filter((k) => selections[k])
    .map((k) => k.charAt(0).toUpperCase() + k.slice(1))

  return `Set up my project with: ${services.join(', ')}.
Create the Supabase project, push the schema, deploy edge functions,
configure all env vars, and verify everything works.`
}
