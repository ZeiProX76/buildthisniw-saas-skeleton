#!/bin/bash
# Pre-commit security scan — secrets, obfuscation, config integrity.
# Works from any repo root. Scans staged files only for speed (<200ms).

set -euo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$REPO_ROOT"

STAGED=$(git diff --cached --name-only --diff-filter=d 2>/dev/null \
  | grep -v node_modules | grep -v '.next/' | grep -v 'package-lock.json' \
  | grep -v 'vendor/' | grep -v 'dist/' | grep -v '__pycache__' \
  | grep -v 'security-scan' || true)

STAGED_CODE=$(echo "$STAGED" | grep -E '\.(js|mjs|ts|tsx|cjs|jsx|py|rb|go|rs|java|php|sh|yaml|yml|toml|config\..*)$' || true)

FAILED=0

block() {
  echo "BLOCKED: $1"
  shift
  for line in "$@"; do echo "  $line"; done
  FAILED=1
}

# ─── 1. SECRETS & CREDENTIALS ────────────────────────────────────
if [[ -n "$STAGED" ]]; then
  for f in $STAGED; do
    [[ -f "$f" ]] || continue

    # Skip binary/media files
    case "$f" in
      *.png|*.jpg|*.jpeg|*.gif|*.webp|*.svg|*.ico|*.woff|*.woff2|*.ttf|*.eot|*.mp4|*.mp3|*.zip|*.tar|*.gz|*.bz2|*.xz|*.pdf|*.dmg|*.exe|*.deb|*.rpm|*.so|*.dylib|*.dll|*.o|*.a|*.class|*.pyc) continue ;;
    esac

    # Skip example/template env files
    case "$f" in *.env.example|*.env.sample|*.env.template) continue ;; esac

    content=$(cat "$f" 2>/dev/null || true)
    [[ -z "$content" ]] && continue

    # Markdown docs get a lighter scan: still check high-signature tokens
    # (AWS AKIA, GitHub ghp_, Stripe sk_live_, Slack xox, PEM keys), but skip
    # generic patterns (connection-string user:pass placeholders, hardcoded-secret
    # heuristics) that produce false positives on legitimate code examples.
    case "$f" in
      *.md|*.mdx)
        if echo "$content" | grep -qE 'AKIA[0-9A-Z]{16}'; then
          block "AWS Access Key in $f" "$(grep -n 'AKIA[0-9A-Z]\{16\}' "$f" | head -3)"
        fi
        if echo "$content" | grep -qE '(sk_live_|rk_live_|whsec_)[A-Za-z0-9]{20,}'; then
          block "Stripe secret key in $f" "$(grep -n 'sk_live_\|rk_live_\|whsec_' "$f" | head -3)"
        fi
        if echo "$content" | grep -qE 'gh[pousr]_[A-Za-z0-9_]{36,}'; then
          block "GitHub token in $f" "$(grep -n 'gh[pousr]_' "$f" | head -3)"
        fi
        if echo "$content" | grep -qE 'xox[bporas]-[A-Za-z0-9-]{10,}'; then
          block "Slack token in $f" "$(grep -n 'xox[bporas]-' "$f" | head -3)"
        fi
        if echo "$content" | grep -qE 'SG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}'; then
          block "SendGrid API key in $f" "$(grep -n 'SG\.' "$f" | head -3)"
        fi
        continue
        ;;
    esac

    # --- Cloud provider keys ---

    # AWS access key
    if echo "$content" | grep -qE 'AKIA[0-9A-Z]{16}'; then
      block "AWS Access Key in $f" "$(grep -n 'AKIA[0-9A-Z]\{16\}' "$f" | head -3)"
    fi

    # AWS secret key
    if echo "$content" | grep -qE '(aws_secret_access_key|AWS_SECRET_ACCESS_KEY)[[:space:]]*[=:][[:space:]]*[A-Za-z0-9/+=]{40}'; then
      block "AWS Secret Key in $f" "$(grep -n -i 'aws_secret' "$f" | head -3)"
    fi

    # GCP service account key file (has "private_key" field)
    if echo "$content" | grep -qE '"private_key"[[:space:]]*:[[:space:]]*"-----BEGIN'; then
      block "GCP service account key in $f"
    fi

    # Azure connection strings
    if echo "$content" | grep -qE 'AccountKey=[A-Za-z0-9/+=]{40,}'; then
      block "Azure connection string in $f" "$(grep -n 'AccountKey=' "$f" | head -3)"
    fi

    # --- Payment & SaaS keys ---

    # Stripe secret/restricted/webhook keys
    if echo "$content" | grep -qE '(sk_live_|rk_live_|whsec_)[A-Za-z0-9]{20,}'; then
      block "Stripe secret key in $f" "$(grep -n 'sk_live_\|rk_live_\|whsec_' "$f" | head -3)"
    fi

    # --- Auth tokens ---

    # GitHub tokens (ghp_, gho_, ghu_, ghs_, ghr_)
    if echo "$content" | grep -qE 'gh[pousr]_[A-Za-z0-9_]{36,}'; then
      block "GitHub token in $f" "$(grep -n 'gh[pousr]_' "$f" | head -3)"
    fi

    # Supabase service role key in assignments
    if echo "$content" | grep -qiE '(service_role|SERVICE_ROLE|supabase_service_role)[[:space:]]*[=:][[:space:]]*eyJ[A-Za-z0-9_-]{50,}'; then
      block "Supabase service role key in $f" "$(grep -n -i 'service_role' "$f" | head -3)"
    fi

    # Generic JWT in assignments (eyJ... longer than anon keys)
    # Only flag if assigned to a secret-sounding variable
    if echo "$content" | grep -qE '(SECRET|PRIVATE|SERVICE_ROLE|SIGNING)[A-Z_]*[[:space:]]*[=:][[:space:]]*["\x27]?eyJ[A-Za-z0-9_-]{100,}'; then
      block "JWT secret in $f" "$(grep -n 'eyJ' "$f" | grep -i 'SECRET\|PRIVATE\|SERVICE_ROLE\|SIGNING' | head -3)"
    fi

    # --- Email/messaging service keys ---

    # Resend API keys (only in assignments, not process.env references)
    if echo "$content" | grep -qE "[=:][[:space:]]*['\"]?re_[A-Za-z0-9]{20,}"; then
      real_resend=$(grep -nE "[=:][[:space:]]*['\"]?re_[A-Za-z0-9]{20,}" "$f" 2>/dev/null | grep -v 'process\.env' | grep -v 'Deno\.env' | grep -v 'your-' | grep -v 'example' || true)
      if [[ -n "$real_resend" ]]; then
        block "Resend API key in $f" "$(echo "$real_resend" | head -3)"
      fi
    fi

    # SendGrid API keys
    if echo "$content" | grep -qE 'SG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}'; then
      block "SendGrid API key in $f" "$(grep -n 'SG\.' "$f" | head -3)"
    fi

    # Twilio keys
    if echo "$content" | grep -qE 'SK[0-9a-fA-F]{32}'; then
      block "Twilio API key in $f" "$(grep -n 'SK[0-9a-fA-F]\{32\}' "$f" | head -3)"
    fi

    # --- Cryptographic material ---

    # Private keys (PEM)
    if echo "$content" | grep -qE '\-\-\-\-\-BEGIN (RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY\-\-\-\-\-'; then
      block "Private key in $f"
    fi

    # --- Database ---

    # Connection strings with embedded passwords
    if echo "$content" | grep -qE '(postgres|postgresql|mysql|mongodb(\+srv)?|redis|amqp):\/\/[^:[:space:]]+:[^@[:space:]]+@'; then
      block "Database connection string with password in $f" "$(grep -n 'postgres://\|postgresql://\|mysql://\|mongodb\|redis://\|amqp://' "$f" | head -3)"
    fi

    # --- Generic high-entropy secrets ---

    # Common secret variable names with real-looking values
    if echo "$content" | grep -qE '(SECRET_KEY|PRIVATE_KEY|API_SECRET|WEBHOOK_SECRET|SIGNING_KEY|AUTH_TOKEN|MASTER_KEY|ENCRYPTION_KEY)[[:space:]]*[=:][[:space:]]*["\x27]?[A-Za-z0-9/+=_-]{20,}'; then
      real_secrets=$(grep -nE '(SECRET_KEY|PRIVATE_KEY|API_SECRET|WEBHOOK_SECRET|SIGNING_KEY|AUTH_TOKEN|MASTER_KEY|ENCRYPTION_KEY)[[:space:]]*[=:][[:space:]]*["\x27]?[A-Za-z0-9/+=_-]{20,}' "$f" 2>/dev/null \
        | grep -v 'your-' | grep -v 'replace' | grep -v 'example' | grep -v 'placeholder' \
        | grep -v 'process\.env' | grep -v 'Deno\.env' | grep -v 'import\.' | grep -v 'os\.environ' || true)
      if [[ -n "$real_secrets" ]]; then
        block "Possible hardcoded secret in $f" "$(echo "$real_secrets" | head -3)"
      fi
    fi

    # Slack tokens
    if echo "$content" | grep -qE 'xox[bporas]-[A-Za-z0-9-]{10,}'; then
      block "Slack token in $f" "$(grep -n 'xox[bporas]-' "$f" | head -3)"
    fi

    # OpenAI / Anthropic API keys
    if echo "$content" | grep -qE '(sk-[A-Za-z0-9]{40,}|sk-ant-[A-Za-z0-9_-]{40,})'; then
      block "AI API key in $f" "$(grep -n 'sk-' "$f" | grep -v 'sk_test_\|sk_live_' | head -3)"
    fi

  done
fi

# ─── 2. DANGEROUS FILE TYPES ─────────────────────────────────────
if [[ -n "$STAGED" ]]; then
  for f in $STAGED; do
    # Block .env files (not examples)
    if echo "$f" | grep -qE '(^|/)\.env$|(^|/)\.env\.(local|production|development|staging)$'; then
      block "Env file staged: $f" "Remove: git reset HEAD $f"
    fi

    # Block credential/key files
    case "$f" in
      *credentials.json|*service-account*.json|*keyfile*.json|*.pem|*.p12|*.pfx|*.key|*id_rsa|*id_ed25519|*id_ecdsa)
        block "Credential file staged: $f" "Remove: git reset HEAD $f"
        ;;
    esac

    # Block .npmrc with auth tokens
    if echo "$f" | grep -qE '(^|/)\.npmrc$'; then
      if grep -qE '//.*:_authToken=' "$f" 2>/dev/null; then
        block ".npmrc with auth token staged: $f" "Remove: git reset HEAD $f"
      fi
    fi
  done
fi

# ─── 3. OBFUSCATION & CODE INJECTION ─────────────────────────────
if [[ -n "$STAGED_CODE" ]]; then
  for f in $STAGED_CODE; do
    [[ -f "$f" ]] || continue
    case "$f" in *.png|*.jpg|*.gif|*.webp|*.svg|*.ico) continue ;; esac

    if grep -qE 'global\[|new Function\(|_\$_[a-z0-9]|\beval\(|String\.fromCharCode|document\.write\(' "$f" 2>/dev/null; then
      block "Obfuscated code in $f" "$(grep -nE 'global\[|new Function\(|_\$_[a-z0-9]|\beval\(|String\.fromCharCode|document\.write\(' "$f" | head -5)"
    fi
  done
fi

# ─── 4. CONFIG FILE INTEGRITY ────────────────────────────────────
# Always check build configs even if not staged
CONFIG_PATTERNS=("postcss.config.*" "tailwind.config.*" "webpack.config.*" "babel.config.*" "rollup.config.*" "vite.config.*" "esbuild.*" "source.config.*")

for pattern in "${CONFIG_PATTERNS[@]}"; do
  for cfg in $(find . -maxdepth 3 -name "$pattern" ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*" 2>/dev/null); do
    if grep -qE 'global\[|Function\(|\beval\(|atob\(|fromCharCode|Buffer\.from.*base64' "$cfg" 2>/dev/null; then
      block "Suspicious code in $cfg" "$(grep -nE 'global\[|Function\(|\beval\(|atob\(|fromCharCode|Buffer\.from.*base64' "$cfg" | head -5)"
    fi
    size=$(wc -c < "$cfg" | tr -d ' ')
    if [[ $size -gt 2000 ]]; then
      block "$cfg is $size bytes (unexpectedly large for a config file)"
    fi
  done
done

# ─── 5. LONG LINES IN CONFIG FILES ───────────────────────────────
if [[ -n "$STAGED_CODE" ]]; then
  for f in $STAGED_CODE; do
    if echo "$f" | grep -qE '\.config\.(mjs|js|cjs|ts)$|postcss|tailwind|webpack|babel|rollup|vite'; then
      [[ -f "$f" ]] || continue
      long=$(awk 'length > 300 {printf "%s:%d (%d chars)\n", FILENAME, NR, length}' "$f" 2>/dev/null || true)
      if [[ -n "$long" ]]; then
        block "Hidden trailing content in $f" "$long"
      fi
    fi
  done
fi

# ─── RESULT ───────────────────────────────────────────────────────
if [[ $FAILED -eq 1 ]]; then
  echo ""
  echo "Commit blocked. Fix the issues above, then try again."
  exit 1
fi
