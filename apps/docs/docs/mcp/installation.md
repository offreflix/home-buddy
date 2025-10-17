---
id: installation
title: Instalação e Configuração do MCP Server
sidebar_position: 2
description: Guia completo para instalar e configurar o MCP Server do Home Buddy
keywords: [mcp, instalação, configuração, setup, docker, claude desktop]
---

# 📦 Instalação e Configuração do MCP Server

Guia completo para instalar e configurar o MCP Server do Home Buddy.

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 18+ instalado
- **Yarn** ou **npm** para gerenciamento de dependências
- **Backend** do Home Buddy rodando (porta 3000)
- **Matcher** do Home Buddy rodando (porta 8000)

### 1. Instalar Dependências

```bash
cd apps/mcp-server
yarn install
```

### 2. Compilar o Projeto

```bash
yarn build
```

### 3. Configurar Variáveis de Ambiente

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Configure as variáveis:

```env
# URLs dos serviços
BACKEND_URL=http://localhost:3000
MATCHER_URL=http://localhost:8000

# Token de autenticação interna
INTERNAL_TOKEN=your-secure-internal-token

# Chave da OpenAI (para matching)
OPENAI_API_KEY=sk-your-openai-key

# Configurações opcionais
REQUEST_TIMEOUT=30000
LOG_LEVEL=info
```

## ⚙️ Configuração Detalhada

### 🔐 Configuração de Segurança

#### Token Interno

O token interno é usado para autenticação entre o MCP Server e os serviços do Home Buddy:

```env
INTERNAL_TOKEN=homebuddy-mcp-secure-token-2024
```

**⚠️ Importante**: Use um token forte e único. Este token deve ser o mesmo configurado no backend.

#### Configuração no Backend

No arquivo `apps/backend/.env`, adicione:

```env
INTERNAL_TOKEN=homebuddy-mcp-secure-token-2024
```

### 🌐 URLs dos Serviços

#### Desenvolvimento Local

```env
BACKEND_URL=http://localhost:3000
MATCHER_URL=http://localhost:8000
```

#### Produção

```env
BACKEND_URL=https://api.homebuddy.com
MATCHER_URL=https://matcher.homebuddy.com
```

### 🤖 Configuração da OpenAI

Para usar as funcionalidades de matching inteligente:

```env
OPENAI_API_KEY=sk-proj-your-openai-key-here
```

**💡 Dica**: Use uma chave específica para o projeto com limites de uso configurados.

## 🚀 Execução

### Desenvolvimento

```bash
yarn dev
```

O servidor iniciará em modo de desenvolvimento com hot-reload.

### Produção

```bash
yarn start
```

O servidor iniciará usando o código compilado em `dist/`.

### Docker

```bash
# Build da imagem
docker build -t home-buddy-mcp-server .

# Execução
docker run -d \
  --name mcp-server \
  --env-file .env \
  -p 3001:3001 \
  home-buddy-mcp-server
```

## 🔧 Configuração Avançada

### ⏱️ Timeouts

Configure timeouts para diferentes operações:

```env
# Timeout geral (ms)
REQUEST_TIMEOUT=30000

# Timeout para matching (ms)
MATCHING_TIMEOUT=60000

# Timeout para scraping (ms)
SCRAPING_TIMEOUT=120000
```

### 📊 Logs

Configure o nível de log:

```env
LOG_LEVEL=info  # debug, info, warn, error
```

### 🔄 Retry Policy

Configure tentativas automáticas:

```env
MAX_RETRIES=3
RETRY_DELAY=1000
```

## 🐳 Docker Compose

### Configuração Completa

Adicione ao `docker-compose.yml`:

```yaml
services:
  mcp-server:
    build:
      context: ./apps/mcp-server
      dockerfile: Dockerfile
    ports:
      - '3001:3001'
    environment:
      - BACKEND_URL=http://backend:3000
      - MATCHER_URL=http://matcher:8000
      - INTERNAL_TOKEN=${INTERNAL_TOKEN}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - backend
      - matcher
    restart: unless-stopped
    networks:
      - home-buddy-network
```

### Execução

```bash
docker-compose up mcp-server
```

## 🧪 Testes

### Testes Unitários

```bash
yarn test
```

### Testes de Integração

```bash
# Teste de conectividade
curl -X POST http://localhost:3001 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}'
```

### Teste com Claude Desktop

1. Configure o Claude Desktop
2. Teste uma ferramenta simples:

```
Claude, liste minhas categorias de produtos
```

## 🔍 Verificação da Instalação

### 1. Verificar Servidor

```bash
# Verificar se o servidor está rodando
ps aux | grep "mcp-server"

# Verificar logs
tail -f logs/mcp-server.log
```

### 2. Testar Conectividade

```bash
# Teste de health check
curl http://localhost:3001/health

# Teste de ferramentas
curl -X POST http://localhost:3001 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}'
```

### 3. Verificar Integração

```bash
# Teste com backend
curl -X GET http://localhost:3000/health \
  -H "Authorization: Bearer your-token"

# Teste com matcher
curl -X GET http://localhost:8000/health
```

## 🚨 Solução de Problemas

### Problemas Comuns

#### 1. Erro de Conexão

```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Solução**: Verifique se o backend está rodando na porta 3000.

#### 2. Token Inválido

```
Error: Unauthorized - Invalid token
```

**Solução**: Verifique se o `INTERNAL_TOKEN` está correto em ambos os serviços.

#### 3. Timeout

```
Error: Request timeout after 30000ms
```

**Solução**: Aumente o `REQUEST_TIMEOUT` ou verifique a conectividade.

### Logs de Debug

Para debug detalhado:

```env
LOG_LEVEL=debug
```

### Verificação de Portas

```bash
# Verificar portas em uso
netstat -tulpn | grep :3001
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000
```

## 📋 Checklist de Instalação

- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (`yarn install`)
- [ ] Projeto compilado (`yarn build`)
- [ ] Arquivo `.env` configurado
- [ ] Backend rodando na porta 3000
- [ ] Matcher rodando na porta 8000
- [ ] Token interno configurado
- [ ] OpenAI API key configurada (opcional)
- [ ] Servidor MCP iniciado
- [ ] Testes de conectividade passando
- [ ] Integração com Claude Desktop funcionando

---

**🎉 MCP Server instalado e configurado com sucesso!**

Próximo passo: [Integração com Claude Desktop](./integration.md)
