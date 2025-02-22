FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.6.0 --activate

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

EXPOSE 3000

CMD ["yarn", "start"]