FROM node:18-bullseye AS base

FROM base AS deps
RUN apt-get update && apt-get install -y openssl ca-certificates libssl-dev
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

FROM node:18-slim AS base

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV REDIS_URL=redis://redis:6379
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

USER node

EXPOSE 3034

ENV PORT=3034

CMD ["node", "src/server.js"]