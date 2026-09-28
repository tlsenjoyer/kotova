#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Working tree has tracked changes; commit or discard them before deployment." >&2
  exit 1
fi

if [ ! -f .env.production ]; then
  echo "Create .env.production from .env.production.example first." >&2
  exit 1
fi

git pull --ff-only
docker compose --env-file .env.production -f compose.production.yml build app
docker compose --env-file .env.production -f compose.production.yml up -d --wait postgres seaweedfs
docker compose --env-file .env.production -f compose.production.yml run --rm --no-deps app node_modules/.bin/prisma migrate deploy
docker compose --env-file .env.production -f compose.production.yml up -d --wait --no-deps app
docker compose --env-file .env.production -f compose.production.yml ps
