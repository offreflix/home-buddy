FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.6.0 --activate

RUN apk add --no-cache \
    chromium \
    harfbuzz \
    ca-certificates \
    ttf-freefont

COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .
COPY .yarn .yarn
COPY packages/ packages/
COPY apps/backend apps/backend/
COPY apps/backend/prisma prisma/

RUN yarn install

RUN yarn dlx prisma generate

WORKDIR /app/apps/backend

ENV NODE_ENV production
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"

EXPOSE 3000

CMD ["yarn", "start"]