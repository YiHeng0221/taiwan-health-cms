FROM node:20-slim AS base
RUN npm install -g pnpm@9

# Set working directory to monorepo root
WORKDIR /app

# Copy workspace config files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared-types/package.json ./packages/shared-types/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared-types ./packages/shared-types
COPY apps/api ./apps/api

# Build shared-types first
RUN pnpm --filter @taiwan-health/shared-types build

# Generate Prisma client
RUN pnpm --filter api db:generate

# Build API
RUN pnpm --filter api build

# Production stage
FROM node:20-slim AS production
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/prisma ./apps/api/prisma
COPY --from=base /app/packages/shared-types ./packages/shared-types

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app/apps/api

EXPOSE 4000

CMD ["node", "dist/main.js"]
