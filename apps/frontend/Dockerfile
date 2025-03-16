FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

WORKDIR /app/apps/frontend

ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

