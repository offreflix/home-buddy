FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.6.0 --activate

COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .
COPY .yarn .yarn
COPY packages/ packages/
COPY apps/frontend apps/frontend/

RUN yarn install

WORKDIR /app/apps/frontend

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN yarn build

EXPOSE 5173

CMD ["yarn", "start", "--port", "5173"]