FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
    chromium \
    harfbuzz \
    ca-certificates \
    ttf-freefont

COPY package.json .

RUN npm install

COPY . .

RUN npx prisma generate

WORKDIR /app/apps/backend

ENV NODE_ENV=production
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"

EXPOSE 3000

CMD ["yarn", "start"]