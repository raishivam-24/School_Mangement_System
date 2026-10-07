# ==============================================================================
# Multi-Stage Dockerfile for School Management SaaS Frontend (React + Vite + Nginx)
# ==============================================================================

# --- Stage 1: Build & Bundle Static Assets ---
FROM node:22-alpine AS builder

WORKDIR /app

# Build arguments for Vite environment
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm ci

# Copy application sources
COPY index.html ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY src ./src/
COPY public ./public/

# Build production bundle to dist/
RUN npm run build

# --- Stage 2: Production Nginx Web Server ---
FROM nginx:alpine AS runner

# Remove default Nginx site files
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration (reverse proxy & SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
