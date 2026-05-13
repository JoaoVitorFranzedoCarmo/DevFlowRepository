FROM node:20-alpine

RUN apk add --no-cache openssl && npm install -g pnpm

WORKDIR /app

# Workspace root files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# packages/types source (workspace dep)
COPY packages/types ./packages/types/

# api package
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile

COPY apps/api/prisma ./apps/api/prisma/

RUN pnpm --filter devflow-backend exec prisma generate

COPY apps/api ./apps/api/

ENV NODE_OPTIONS="--max-old-space-size=256"
RUN pnpm --filter devflow-backend build

WORKDIR /app/apps/api

COPY apps/api/entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["./entrypoint.sh"]
