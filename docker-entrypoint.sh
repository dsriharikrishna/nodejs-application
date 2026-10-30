#!/bin/sh
set -e

echo "📦 Running Prisma database migrations..."
npx prisma migrate deploy

echo "🚀 Starting Node.js server..."
exec node dist/server.js

