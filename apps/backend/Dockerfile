FROM node:20-alpine

# Instalar dependências do sistema para Puppeteer e Chromium
RUN apk add --no-cache \
    chromium \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nss \
    freetype \
    freetype-dev

WORKDIR /app

# Copiar apenas os arquivos necessários do backend
COPY package.json ./
COPY yarn.lock* ./

# Instalar dependências usando npm com --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copiar código fonte
COPY . ./

# Configurar ambiente
ENV NODE_ENV=production
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Gerar cliente Prisma
RUN npx prisma generate

# Build da aplicação
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "prod"]