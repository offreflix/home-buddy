FROM node:20-alpine

WORKDIR /app

# Instalar dependências
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação
RUN yarn build

# Usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S mcp -u 1001
USER mcp

EXPOSE 3001

CMD ["yarn", "start"]
