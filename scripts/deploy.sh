#!/usr/bin/env bash
#
# Floreat deploy script — run on the EC2 instance to update the live app.
#
# It is called automatically by the GitHub Actions self-hosted runner
# (.github/workflows/deploy.yml) on every push to `main`, and can also be run
# by hand over SSH. It updates the checkout at APP_DIR *in place* so the paths
# PM2 and Nginx already point at (~/floreat/backend/dist, ~/floreat/frontend/dist)
# keep working.
#
# Safety ordering: pull -> install -> typecheck -> test -> build -> migrate ->
# restart -> reload. Tests run BEFORE build/migrate/restart, so if a test fails
# the script aborts and the live app keeps running the previous, working code.

# set -e          : exit immediately if any command fails (non-zero exit).
# set -u          : treat use of an unset variable as an error.
# set -o pipefail : a pipeline fails if ANY command in it fails, not just the last.
set -euo pipefail

# Where the app lives on the server. Override by exporting APP_DIR before running.
APP_DIR="${APP_DIR:-/home/ubuntu/floreat}"

# The branch we deploy from. Override by exporting DEPLOY_BRANCH before running.
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"

# The PM2 process name for the backend (created in README section 15).
PM2_APP="${PM2_APP:-floreat-api}"

# Print each step with a timestamp so the Actions log is easy to read.
log() { printf '\n=== [deploy] %s: %s\n' "$(date +%H:%M:%S)" "$1"; }

cd "$APP_DIR"

log "Fetching latest code ($DEPLOY_BRANCH)"
# --ff-only refuses to create a merge commit: if the server's history diverged
# from the remote, the deploy stops instead of silently merging.
git fetch origin "$DEPLOY_BRANCH"
git checkout "$DEPLOY_BRANCH"
git pull --ff-only origin "$DEPLOY_BRANCH"

log "Installing dependencies (all workspaces)"
# 'npm ci' would be stricter, but it deletes node_modules first and needs a
# committed package-lock.json; 'npm install' matches the README's manual flow.
npm install

log "Type-checking (gate 1/2)"
npm run typecheck

log "Running tests (gate 2/2)"
npm run test

log "Building shared + frontend + backend"
npm run build

log "Applying database migrations (production-safe)"
# Runs 'prisma migrate deploy' inside the backend workspace. It only applies
# already-committed migrations; it never resets data or generates new ones.
npm run db:migrate:deploy --workspace backend

log "Restarting the backend under PM2"
# --update-env re-reads backend/.env so changed env vars take effect.
pm2 restart "$PM2_APP" --update-env

log "Reloading Nginx to serve the fresh frontend build"
# Passwordless sudo for exactly this command is granted in
# /etc/sudoers.d/floreat-deploy (see CI-CD Pipeline.md section 3).
sudo systemctl reload nginx

log "Deploy complete ✅"
