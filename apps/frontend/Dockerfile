FROM node:20-alpine

WORKDIR /app

# Copiar apenas os arquivos necessários do frontend
COPY package.json ./
COPY yarn.lock* ./

# Instalar dependências usando npm com --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copiar código fonte
COPY . ./

# Build da aplicação
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]

