FROM node:18-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production && npm cache clean --force

RUN npx prisma generate

FROM base AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci


COPY . .


RUN npm run build


FROM node:18-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs


COPY --from=base /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./


RUN npx prisma generate

USER nestjs

EXPOSE 3000


ENV NODE_ENV=production
ENV PORT=3000


CMD ["node", "dist/main.js"]