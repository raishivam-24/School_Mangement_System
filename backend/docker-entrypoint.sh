#!/bin/sh
set -e

echo "🚀 [SchoolHub Backend] Initializing container..."

# Synchronize database schema with PostgreSQL using Prisma
echo "📦 [Prisma] Synchronizing database schema with PostgreSQL..."
npx prisma db push --skip-generate || {
  echo "⚠️ [Prisma] Warning: db push exited with code $?, continuing..."
}

echo "✅ [SchoolHub Backend] Starting Application Server..."
exec "$@"
