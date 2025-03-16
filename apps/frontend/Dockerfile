FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

WORKDIR /app/apps/frontend

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

