#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   export VERCEL_TOKEN=...           # required
#   export VERCEL_PROJECT=...         # required (project name or ID)
#   export VERCEL_SCOPE=...           # optional (team slug)
#   export SA_JSON_PATH=/abs/path/to/service-account.json  # or set SA_JSON_B64 (base64-encoded JSON)
#   export GCS_BUCKET_NAME=...        # optional; if omitted, will not set
#   export GCS_PUBLIC_READ=true       # optional; defaults to true
#   ./scripts/configure_vercel_env.sh
#
# Notes:
# - This script does NOT require gcloud. It only uses the service account file to derive values.
# - It will set vars for both production and preview environments.

if [[ "${VERCEL_TOKEN:-}" == "" ]]; then
  echo "ERROR: VERCEL_TOKEN is required" >&2
  exit 1
fi
if [[ "${VERCEL_PROJECT:-}" == "" ]]; then
  echo "ERROR: VERCEL_PROJECT is required" >&2
  exit 1
fi

# Resolve service account JSON
TMP_SA_JSON=""
if [[ -n "${SA_JSON_PATH:-}" ]]; then
  if [[ ! -f "$SA_JSON_PATH" ]]; then
    echo "ERROR: SA_JSON_PATH does not exist: $SA_JSON_PATH" >&2
    exit 1
  fi
  TMP_SA_JSON="$SA_JSON_PATH"
elif [[ -n "${SA_JSON_B64:-}" ]]; then
  TMP_SA_JSON="$(mktemp)"
  echo "$SA_JSON_B64" | base64 -d > "$TMP_SA_JSON"
else
  echo "ERROR: Provide either SA_JSON_PATH or SA_JSON_B64" >&2
  exit 1
fi

# Extract required fields from JSON using Python (avoids jq dependency)
readarray -t SA_VALUES < <(python3 - "$TMP_SA_JSON" <<'PY'
import json, sys
p = json.load(open(sys.argv[1]))
print(p.get('project_id',''))
print(p.get('client_email',''))
print(p.get('private_key',''))
PY
)
GOOGLE_PROJECT_ID="${SA_VALUES[0]}"
GOOGLE_CLIENT_EMAIL="${SA_VALUES[1]}"
GOOGLE_PRIVATE_KEY="${SA_VALUES[2]}"

if [[ -z "$GOOGLE_PROJECT_ID" || -z "$GOOGLE_CLIENT_EMAIL" || -z "$GOOGLE_PRIVATE_KEY" ]]; then
  echo "ERROR: Failed to parse service account JSON (missing project_id/client_email/private_key)" >&2
  exit 1
fi

# Defaults
GCS_PUBLIC_READ="${GCS_PUBLIC_READ:-true}"

# Compose Vercel CLI flags
VERCEL_CMD=(npx -y vercel@latest)
VERCEL_FLAGS=(--token "$VERCEL_TOKEN" --project "$VERCEL_PROJECT")
if [[ -n "${VERCEL_SCOPE:-}" ]]; then
  VERCEL_FLAGS+=(--scope "$VERCEL_SCOPE")
fi

add_env() {
  local name="$1"; shift
  local value="$1"; shift
  for env in production preview; do
    # We pipe the value to avoid interactive prompt
    printf %s "$value" | "${VERCEL_CMD[@]}" env add "$name" "$env" "${VERCEL_FLAGS[@]}"
  done
}

# Set required env vars
add_env GOOGLE_PROJECT_ID "$GOOGLE_PROJECT_ID"
add_env GOOGLE_CLIENT_EMAIL "$GOOGLE_CLIENT_EMAIL"
add_env GOOGLE_PRIVATE_KEY "$GOOGLE_PRIVATE_KEY"

# Optional vars
if [[ -n "${GCS_BUCKET_NAME:-}" ]]; then
  add_env GCS_BUCKET_NAME "$GCS_BUCKET_NAME"
fi
add_env GCS_PUBLIC_READ "$GCS_PUBLIC_READ"

echo "Done. Environment variables have been added to Vercel (production and preview)."