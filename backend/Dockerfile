# =========================================
# Base stage - dependencies bersama
# =========================================
FROM node:22-alpine AS base
WORKDIR /app
# openssl dibutuhkan Prisma di Alpine
RUN apk add --no-cache openssl libc6-compat
COPY package*.json ./
COPY prisma ./prisma

# =========================================
# Dev stage - dipakai docker-compose untuk development
# =========================================
FROM base AS dev
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# =========================================
# Build stage - compile TypeScript untuk production
# =========================================
FROM base AS build
RUN npm ci
COPY . .
RUN npm run prisma:generate
RUN npm run build

# =========================================
# Production stage - image final, ramping kecil
# =========================================
FROM node:22-alpine AS prod
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev
RUN npx prisma generate

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
