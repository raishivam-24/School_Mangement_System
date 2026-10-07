# ==============================================================================
# Multi-Stage Dockerfile for School Management SaaS Backend (Express + TypeScript + Prisma)
# ==============================================================================

# --- Stage 1: Build & Compile TypeScript ---
FROM node:22-alpine AS builder

WORKDIR /app

# Install OpenSSL (required for Prisma Query Engine)
RUN apk add --no-cache openssl

# Install dependencies
COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma/
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy application source & compile TypeScript to dist/
COPY tsconfig.json ./
COPY src ./src/
RUN npm run build

# --- Stage 2: Production Container ---
FROM node:22-alpine AS runner

WORKDIR /app

# Install OpenSSL and utilities for healthcheck & database operations
RUN apk add --no-cache openssl curl

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma/

# Install dependencies (retaining Prisma CLI and tsx for runtime migrations & seeding)
RUN npm ci

# Copy generated Prisma Client artifacts & compiled JavaScript from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/dist ./dist

# Copy entrypoint startup script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/server.js"]
