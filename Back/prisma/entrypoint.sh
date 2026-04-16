#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

if [ "${SEED_DB:-false}" = "true" ]; then
  echo "Seeding database..."
  npx ts-node prisma/seed.ts
fi

echo "Starting server..."
exec node dist/server.js
