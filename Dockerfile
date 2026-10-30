# ── Stage 1: builder ─────────────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency specifications
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY prisma ./prisma

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Generate Prisma client
RUN pnpm exec prisma generate

# Copy source and build TypeScript
COPY tsconfig.json ./
COPY src ./src
RUN pnpm run build

# ── Stage 2: production runner ───────────────────────────────────────────────
FROM node:20-slim AS runner

WORKDIR /app

# Install openssl and curl/wget for healthcheck
RUN apt-get update -y && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3001

# Create unprivileged application user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Copy production files and dependencies from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

USER appuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3001/v1/api/health || exit 1

CMD ["node", "dist/server.js"]

