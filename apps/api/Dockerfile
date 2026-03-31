FROM node:20-slim AS base

# Install pnpm and OpenSSL (needed for Prisma)
RUN npm install -g pnpm@9 && \
    apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

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

# Generate Prisma client and build API
WORKDIR /app/apps/api
RUN npx prisma generate

# Use tsc directly (nest build relies on tsconfig.build.json which may not exist)
RUN npx tsc -p tsconfig.json --outDir dist

# Verify build output
RUN ls -la dist/main.js

# Production stage
FROM node:20-slim AS production

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/prisma ./apps/api/prisma
COPY --from=base /app/apps/api/package.json ./apps/api/package.json
COPY --from=base /app/packages/shared-types ./packages/shared-types

WORKDIR /app/apps/api

CMD ["node", "dist/main.js"]
