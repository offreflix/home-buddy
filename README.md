# 🏠 Home Buddy

<div align="center">

**Sistema Inteligente de Gestão Doméstica**

_Organize seus produtos, automatize compras e tenha controle total do seu lar_

[![Tecnologias](https://img.shields.io/badge/Next.js-15.1.5-black)](https://nextjs.org/)
[![Tecnologias](https://img.shields.io/badge/NestJS-10.x-red)](https://nestjs.com/)
[![Tecnologias](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tecnologias](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green)](https://openai.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

</div>

---

## 📋 Sobre o Projeto

**Home Buddy** é uma aplicação completa para gestão inteligente de produtos domésticos. Desenvolvida com arquitetura de microsserviços em monorepositório, oferece uma experiência moderna e intuitiva para organizar, controlar e otimizar o dia a dia doméstico.

### 🎯 O que o Home Buddy faz?

- **📦 Gestão de Produtos**: Cadastre e organize todos os seus produtos domésticos
- **🛒 Controle de Estoque**: Monitore quantidades desejadas vs atuais em tempo real
- **🔍 Busca Inteligente**: Encontre produtos rapidamente com filtros avançados
- **🌐 Web Scraping Automático**: Extraia produtos automaticamente de notas fiscais online
- **🤖 Matching Inteligente**: Compare produtos extraídos com seu catálogo usando IA
- **📊 Dashboard Analítico**: Visualize estatísticas e insights sobre seus produtos
- **🔐 Autenticação Robusta**: Sistema de login seguro com Google OAuth e JWT
- **📈 Rastreamento Completo**: Monitoramento detalhado de todas as operações

### 🚀 Principais Funcionalidades

#### Gestão de Produtos

- ✅ Cadastro de produtos com categorias personalizadas
- ✅ Controle de estoque (quantidade atual vs desejada)
- ✅ Unidades de medida flexíveis (kg, L, unidade, pacote, etc.)
- ✅ Movimentações de entrada/saída com histórico completo
- ✅ Busca global com filtros avançados

#### Web Scraping Inteligente

- ✅ Extração automática de produtos de notas fiscais online
- ✅ Suporte a múltiplos supermercados
- ✅ Processamento assíncrono com filas BullMQ
- ✅ Interface de acompanhamento em tempo real

#### Matching com IA

- ✅ Comparação inteligente usando OpenAI GPT-4o-mini
- ✅ Taxa de acerto superior a 90%
- ✅ Aprendizado contínuo com feedback do usuário
- ✅ Processamento em lote para otimização

#### Sistema de Tracking Avançado

- ✅ Rastreamento completo de todas as operações
- ✅ Monitoramento de custos com IA
- ✅ Análise de performance e tempos de resposta
- ✅ Logs detalhados para debugging

#### Exportação e Relatórios

- ✅ Exportação de produtos em formato CSV
- ✅ Filtros avançados para exportação (estoque baixo, etc.)
- ✅ Relatórios resumidos de estoque
- ✅ Estatísticas por categoria e período

#### Dashboard Analítico

- ✅ Cards informativos (total de produtos, estoque baixo, etc.)
- ✅ Gráfico de produtos mais consumidos
- ✅ Gráfico de distribuição por categorias (pizza chart)
- ✅ Gráfico de movimentações de estoque ao longo do tempo
- ✅ Visualização em tempo real do status do sistema

---

## 🏗️ Arquitetura da Aplicação

```
home-buddy-monorepo/
├── apps/
│   ├── frontend/          # 🖥️  Interface Web (Next.js)
│   ├── backend/           # 🚀 API Principal (NestJS)
│   ├── matcher/           # 🤖 Serviço de IA (FastAPI)
│   ├── mcp-server/        # 🔌 Servidor MCP (Model Context Protocol)
│   └── docs/              # 📚 Documentação adicional
├── packages/              # 📦 Componentes Compartilhados
│   ├── eslint-config/     # Configurações ESLint compartilhadas
│   ├── typescript-config/  # Configurações TypeScript compartilhadas
│   └── ui/                # 🎨 Biblioteca de componentes UI (Shadcn/ui)
└── docker-compose.yml     # 🐳 Orquestração de Serviços
```

### 🛠️ Stack Tecnológica

#### Frontend (Next.js)

- **Framework**: Next.js 15.1.5 com App Router
- **Linguagem**: TypeScript 5.x
- **UI/UX**: Tailwind CSS 4.0 + Shadcn/ui + Radix UI
- **Estado**: Zustand + React Query (TanStack Query)
- **Formulários**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Tabelas**: TanStack Table
- **Tema**: next-themes (Dark/Light mode)
- **Notificações**: Sonner (Toast)
- **Testes**: Vitest + Testing Library

#### Backend (NestJS)

- **Framework**: NestJS 10.x
- **Linguagem**: TypeScript 5.x
- **Banco**: PostgreSQL 15+ com Prisma ORM
- **Cache/Sessões**: Redis 7+ (ioredis)
- **Autenticação**: JWT + Google OAuth 2.0 (Passport)
- **Filas**: BullMQ (Bull) para processamento assíncrono
- **Monitoramento**: Bull Board Dashboard
- **Web Scraping**: Puppeteer Core
- **Documentação**: Swagger/OpenAPI
- **Validação**: class-validator + class-transformer
- **Testes**: Jest (unitários e E2E)

#### Serviço de IA (FastAPI)

- **Framework**: FastAPI (Python)
- **IA**: OpenAI GPT-4o-mini
- **Autenticação**: Token interno service-to-service
- **Comunicação**: HTTP com validação Pydantic

#### Infraestrutura

- **Containerização**: Docker + Docker Compose
- **Orquestração**: Docker Compose com redes isoladas
- **Banco**: PostgreSQL com healthchecks
- **Cache**: Redis com persistência
- **Monorepo**: Yarn Workspaces 4.6.0 + Turbo
- **Build System**: Turbo para builds incrementais
- **Linting**: ESLint com configurações compartilhadas
- **Formatação**: Prettier

### 🔄 Fluxos de Dados

#### 1. Fluxo de Scraping + Matching

```
URL NFC → Scraping Service → Extração de Produtos → Matcher Service →
Comparação com IA → Matching Results → Atualização de Estoque
```

#### 2. Fluxo de Autenticação

```
Login → Google OAuth/JWT → Geração de Tokens → Redis Cache →
Validação Guards → Acesso Autorizado
```

#### 3. Fluxo de Tracking

```
Operação Iniciada → OperationLog → ScrapingLog/MatchingLog/LLMLog →
Métricas Coletadas → Relatórios Gerados
```

---

## 🚀 Guia de Instalação e Configuração

### 📋 Pré-requisitos

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **Yarn** 4.6.0+ ([Instalação](https://yarnpkg.com/getting-started/install))
- **Docker** + Docker Compose ([Guia](https://docs.docker.com/get-docker/))
- **Git** ([Download](https://git-scm.com/))

### ⚡ Instalação Rápida (Docker)

#### 1. Clone o repositório

```bash
git clone https://github.com/offreflix/home-buddy
cd home-buddy-monorepo
```

#### 2. Configure variáveis de ambiente

```bash
# Crie o arquivo .env no diretório apps/matcher/
cp apps/matcher/.env.example apps/matcher/.env
# Edite com suas chaves da OpenAI
```

#### 3. Inicie todos os serviços

```bash
# Construir e iniciar
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

#### 4. Execute as migrações

```bash
# Aguardar PostgreSQL ficar pronto (~30s)
docker-compose exec backend yarn prisma migrate deploy
```

#### 5. Acesse a aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Documentação API**: http://localhost:3001/api
- **Bull Board Dashboard**: http://localhost:3001/queues (Monitoramento de filas)

### 🔧 Configuração Manual (Desenvolvimento)

#### Backend (NestJS)

```bash
cd apps/backend
yarn install
yarn prisma migrate dev
yarn start:dev
```

#### Frontend (Next.js)

```bash
cd apps/frontend
yarn install
yarn dev
# Acesse: http://localhost:1598 (porta padrão em desenvolvimento)
```

#### Serviço de IA (FastAPI)

```bash
cd apps/matcher
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# ou .venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 🐳 Serviços Docker

| Serviço        | Porta Externa | Porta Interna | Descrição             |
| -------------- | ------------- | ------------- | --------------------- |
| **Frontend**   | 3000          | 3000          | Interface web Next.js |
| **Backend**    | 3001          | 3000          | API NestJS            |
| **Matcher**    | 8000          | 8000          | Serviço de IA FastAPI |
| **PostgreSQL** | 5432          | 5432          | Banco de dados        |
| **Redis**      | 6379          | 6379          | Cache e sessões       |

**Nota**: Em desenvolvimento local (sem Docker), o frontend roda na porta **1598** por padrão.

---

## 📖 Guia de Uso

### 🎯 Primeiros Passos

1. **Acesse** http://localhost:3000 (Docker) ou http://localhost:1598 (desenvolvimento)
2. **Registre-se** ou faça login com Google
3. **Crie categorias** para seus produtos
4. **Adicione produtos** ao seu catálogo
5. **Configure estoques** desejados
6. **Explore o Dashboard** para visualizar estatísticas e gráficos

### 🖥️ Interface do Frontend

#### Dashboard Principal

O dashboard oferece uma visão completa do seu estoque:

- **Total de Produtos**: Card com contagem total de produtos cadastrados
- **Estoque Baixo**: Lista de produtos que estão abaixo da quantidade desejada
- **Produtos Mais Consumidos**: Ranking dos produtos com maior movimentação
- **Gráfico de Movimentações**: Visualização temporal das entradas e saídas
- **Gráfico de Categorias**: Distribuição de produtos por categoria (pizza chart)

#### Página de Produtos

- **Tabela de Produtos**: Visualização em tabela com filtros avançados
- **Cards de Produtos**: Visualização em cards com informações resumidas
- **Filtros Avançados**: Por categoria, estoque, unidade, etc.
- **Busca Inteligente**: Busca em tempo real com debounce
- **Ações em Lote**: Operações múltiplas em produtos selecionados
- **Sugestões Inteligentes**: Sugestões baseadas em padrões de uso

#### Página de Scraping

- **Formulário de Scraping**: Interface para adicionar URLs de notas fiscais
- **Histórico de Jobs**: Lista de todos os scrapings realizados
- **Progresso em Tempo Real**: Acompanhamento do status dos jobs
- **Resultados de Matching**: Visualização dos matches sugeridos pela IA
- **Aprovação de Matches**: Interface para aprovar ou rejeitar matches

### 📦 Gerenciamento de Produtos

#### Criar Produto

```typescript
// Via API
POST /products
{
  "name": "Arroz Branco",
  "categoryId": 1,
  "unit": "kg",
  "description": "Arroz branco tipo 1"
}
```

#### Controle de Estoque

- Defina quantidade desejada por produto
- Receba alertas quando estoque estiver baixo
- Registre movimentações de entrada/saída

### 🌐 Web Scraping

#### Processo Básico

1. **Obtenha URL** da nota fiscal online
2. **Inicie scraping** via interface ou API
3. **Acompanhe progresso** em tempo real
4. **Revise matches** sugeridos pela IA

#### Exemplo de Uso

```bash
# Scraping assíncrono
curl -X POST http://localhost:3001/scrapping/queue \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "url": "https://exemplo.com/nota-fiscal",
    "userId": 1
  }'

# Múltiplos scrapings
curl -X POST http://localhost:3001/scrapping/queue/multiple \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "urls": [
      "https://exemplo.com/nota-fiscal-1",
      "https://exemplo.com/nota-fiscal-2"
    ],
    "userId": 1
  }'

# Verificar status do job
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/scrapping/queue/status/job-12345"
```

### 🤖 Matching Inteligente

#### Como Funciona

- Produtos extraídos são enviados para o serviço de IA
- GPT-4o-mini compara com seu catálogo pessoal
- Resultados com confiança > 80% são sugeridos
- Você aprova ou rejeita cada match

#### Configuração da IA

```ini
# apps/matcher/.env
OPENAI_API_KEY=sk-your-key-here
INTERNAL_TOKEN=secure-service-token
BACKEND_BASE_URL=http://backend:3000
```

### 📊 Sistema de Tracking

#### Métricas Disponíveis

- Tempo de resposta de cada operação
- Custo total com OpenAI (por período)
- Taxa de sucesso de matching
- Performance do scraping
- Contagem de operações por tipo e status
- Estatísticas agregadas por período

#### Consultar Estatísticas

```bash
# Custos da última semana
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/tracking/llm-costs?days=7"

# Operações em andamento
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/tracking/running"

# Estatísticas gerais do último mês
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/tracking/stats?days=30"

# Operações com filtros
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/tracking/operations?operationType=SCRAPING_MATCHING&status=COMPLETED&limit=10"
```

### 📤 Exportação de Dados

#### Exportar Produtos

```bash
# Exportar todos os produtos em CSV
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/export/products" \
  --output produtos.csv

# Exportar apenas produtos com estoque baixo
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/export/products?lowStock=true" \
  --output produtos_estoque_baixo.csv

# Gerar relatório resumido
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/export/reports/stock-summary"
```

---

## 📊 Modelo de Dados

### Entidades Principais

- **User**: Usuários do sistema (com suporte a Google OAuth)
- **Category**: Categorias de produtos
- **Product**: Produtos cadastrados pelos usuários
- **Stock**: Controle de estoque (quantidade atual vs desejada)
- **StockMovement**: Histórico de movimentações de estoque (entrada/saída)
- **OperationLog**: Log principal de todas as operações
- **ScrapingLog**: Logs específicos de operações de scraping
- **MatchingLog**: Logs de operações de matching com IA
- **LLMLog**: Logs detalhados de chamadas à OpenAI (tokens, custos, etc.)

### Enums

- **Unit**: kg, g, L, lata, pacote, unidade
- **MovementType**: IN, OUT
- **OperationType**: SCRAPING_ONLY, SCRAPING_MATCHING, MATCHING_ONLY
- **OperationStatus**: RUNNING, COMPLETED, FAILED, CANCELLED

---

## 🔌 API Reference

### Autenticação

```
POST /auth/login           - Login tradicional (email/senha)
POST /auth/register         - Registro de usuário
GET  /auth/google           - Login com Google OAuth
POST /auth/refresh          - Refresh token JWT
POST /auth/logout           - Logout (invalida tokens)
POST /auth/link-google      - Vincular conta Google a usuário existente
```

**Nota**: A maioria dos endpoints requer autenticação via Bearer Token (JWT).

### Produtos

```
GET    /products                      - Listar produtos (com paginação)
POST   /products                      - Criar produto
GET    /products/id/:id               - Buscar produto por ID
GET    /products/count                - Contar total de produtos
GET    /products/low-stock            - Listar produtos com estoque baixo
GET    /products/most-consumed        - Produtos mais consumidos
GET    /products/count-by-category    - Contagem de produtos por categoria
GET    /products/movements            - Histórico de movimentações de estoque
PATCH  /products/id/:id               - Atualizar produto
PATCH  /products/update-stock/:id     - Atualizar estoque do produto
DELETE /products/:id                  - Deletar produto
```

**Parâmetros de Paginação** (para `/products`):

- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)
- `search`: Busca por nome/descrição
- `categoryId`: Filtrar por categoria
- `lowStock`: true/false - Filtrar apenas produtos com estoque baixo

### Scraping

```
GET    /scrapping?url=...           - Scraping síncrono
POST   /scrapping/queue             - Scraping assíncrono
POST   /scrapping/queue/multiple    - Múltiplos scrapings
GET    /scrapping/queue/status/:id  - Status do job
GET    /scrapping/queue/stats       - Estatísticas da fila
POST   /scrapping/queue/clean       - Limpar jobs completados/falhados
POST   /scrapping/queue/pause       - Pausar fila de processamento
POST   /scrapping/queue/resume      - Retomar fila de processamento
```

### Tracking

```
GET    /tracking/operations         - Histórico de operações (com filtros)
GET    /tracking/operations/:jobId - Detalhes da operação por Job ID
GET    /tracking/stats              - Estatísticas gerais (por período)
GET    /tracking/llm-costs         - Custos com IA (por período)
GET    /tracking/running           - Operações ativas em execução
GET    /tracking/failed            - Operações que falharam
```

**Parâmetros de Filtro** (para `/tracking/operations`):

- `operationType`: SCRAPING_ONLY | SCRAPING_MATCHING | MATCHING_ONLY
- `status`: RUNNING | COMPLETED | FAILED | CANCELLED
- `startDate`: Data inicial (ISO 8601)
- `endDate`: Data final (ISO 8601)
- `limit`: Limite de resultados (padrão: 50)
- `offset`: Offset para paginação (padrão: 0)
- `allUsers`: true/false - Incluir operações de todos os usuários (admin)

### Categorias

```
GET    /categories       - Listar categorias
POST   /categories       - Criar categoria
PUT    /categories/:id   - Atualizar categoria
DELETE /categories/:id   - Deletar categoria
```

### Exportação

```
GET    /export/products              - Exportar produtos em CSV
GET    /export/reports/stock-summary - Gerar relatório resumido do estoque
```

**Parâmetros de Exportação** (para `/export/products`):

- `lowStock`: true/false - Filtrar apenas produtos com estoque baixo

### Estoque (Stocks)

```
GET    /stocks              - Listar todos os estoques
POST   /stocks              - Criar novo estoque
GET    /stocks/:id          - Buscar estoque por ID
PATCH  /stocks/:id          - Atualizar estoque
DELETE /stocks/:id          - Deletar estoque
```

**Nota**: O estoque é geralmente gerenciado através dos endpoints de produtos (`/products/update-stock/:id`).

### Usuários

```
POST   /users/user       - Criar novo usuário (registro)
```

---

## 🔄 Sistema de Filas (BullMQ)

### Arquitetura

- **Producer**: Backend NestJS adiciona jobs
- **Consumer**: Processador assíncrono executa scraping
- **Storage**: Redis mantém estado dos jobs
- **Monitor**: Dashboard Bull para visualização

### Tipos de Jobs

1. **Scraping Individual**: Uma URL por job
2. **Scraping Múltiplo**: Várias URLs em lote
3. **Matching**: Comparação IA (interno)

### Configurações

```typescript
// Retry automático
individualJob: { attempts: 3, backoff: { type: 'exponential', delay: 2000 } }
multipleJob: { attempts: 2, backoff: { type: 'exponential', delay: 5000 } }

// Limpeza automática
removeOnComplete: 100,
removeOnFail: 50
```

### Monitoramento

```bash
# Status da fila
GET /scrapping/queue/stats

# Status específico
GET /scrapping/queue/status/{jobId}

# Dashboard visual Bull Board
# Acesse: http://localhost:3001/queues
# Visualize jobs em tempo real, estatísticas e histórico
```

---

## 📈 Sistema de Tracking e Monitoramento

### O que é Rastreado

#### Por Operação

- ID único do job
- Usuário responsável
- Tipo de operação (scraping, matching, etc.)
- Status atual (running, completed, failed)
- Tempo de início/fim e duração
- Metadados específicos

#### Por Scraping

- URL processada
- Dados de entrada/saída
- Status HTTP
- Tempo de resposta
- Detalhes de erro

#### Por Matching

- Produtos enviados/recebidos
- Request/response completos
- Contadores de matches/unmatches
- Tempo de resposta da IA

#### Por LLM (OpenAI)

- Prompt e resposta completos
- Contagem de tokens (prompt/response/total)
- Custo calculado em USD
- Provider e modelo utilizados
- Temperatura e parâmetros

### Benefícios

- **Transparência Total**: Visibilidade completa
- **Controle de Custos**: Monitoramento preciso com IA
- **Debugging Eficiente**: Logs detalhados
- **Otimização**: Dados para melhorar performance

### Exemplos Práticos

```bash
# Monitorar custos semanais
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/tracking/llm-costs?days=7"

# Investigar operação específica
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/tracking/operations/job-12345"

# Estatísticas gerais (últimos 30 dias)
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/tracking/stats?days=30"
```

---

## 🔐 Segurança

### Autenticação

- **JWT**: Access (15min) + Refresh (7 dias)
- **Google OAuth**: Integração completa
- **Bcrypt**: Hashing de senhas
- **Redis**: Lista negra de tokens

### Autorização

- **Guards**: Proteção de rotas
- **Roles**: Sistema preparado para roles
- **CORS**: Configurado por ambiente

### Dados Sensíveis

- **Cookies HTTP-only**: Prevenção XSS
- **HTTPS**: Sempre em produção
- **Rate Limiting**: Preparado para implementação

---

## 🧪 Testes

### Backend (Jest)

```bash
cd apps/backend
yarn test                # Testes unitários
yarn test:e2e           # Testes end-to-end
yarn test:cov           # Cobertura de testes
```

### Frontend (Vitest)

```bash
cd apps/frontend
yarn test               # Testes unitários
yarn test:e2e           # Testes Playwright
```

### Matcher (Pytest)

```bash
cd apps/matcher
pytest -q               # Testes unitários
pytest --cov=app        # Cobertura
```

---

## ⚙️ Variáveis de Ambiente

### Backend (NestJS)

Crie um arquivo `.env` no diretório `apps/backend/`:

```env
# Banco de Dados
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/home_buddy

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:1598

# Ambiente
NODE_ENV=development
PORT=3000
```

### Frontend (Next.js)

Crie um arquivo `.env.local` no diretório `apps/frontend/`:

```env
# URL da API Backend
# Em desenvolvimento local: http://localhost:3000
# Com Docker: http://localhost:3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Matcher (FastAPI)

Crie um arquivo `.env` no diretório `apps/matcher/`:

```env
# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Token interno para autenticação service-to-service
INTERNAL_TOKEN=secure-service-token-change-in-production

# URL do Backend (interno no Docker)
BACKEND_BASE_URL=http://backend:3000
```

**Nota**: Para produção, use variáveis de ambiente seguras e nunca commite arquivos `.env` com credenciais reais.

---

## 🚀 Deploy

### Produção (Docker)

```bash
# Build otimizado
docker-compose -f docker-compose.prod.yml up --build -d

# Com variáveis de ambiente
docker-compose --env-file .env.prod up -d
```

### Variáveis de Produção

```env
# Backend
DATABASE_URL=postgresql://...
REDIS_HOST=redis-prod
JWT_SECRET=your-production-secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Matcher
OPENAI_API_KEY=sk-production-key
INTERNAL_TOKEN=secure-prod-token

# Frontend
NEXT_PUBLIC_API_URL=https://api.homebuddy.com
```

---

## 🤝 Contribuição

1. **Fork** o projeto
2. **Clone** sua fork: `git clone https://github.com/seu-usuario/home-buddy`
3. **Crie** uma branch: `git checkout -b feature/nova-funcionalidade`
4. **Commit** suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
5. **Push** para a branch: `git push origin feature/nova-funcionalidade`
6. **Abra** um Pull Request

### 📝 Padrões de Código

- **ESLint**: Configurado para TypeScript
- **Prettier**: Formatação automática
- **Husky**: Pre-commit hooks
- **Commit Convention**: Conventional Commits

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Suporte

- **📧 Email**: suporte@homebuddy.com
- **🐛 Issues**: [GitHub Issues](https://github.com/offreflix/home-buddy/issues)
- **💬 Discord**: [Servidor Discord](https://discord.gg/homebuddy)
- **📖 Documentação**: [Wiki](https://github.com/offreflix/home-buddy/wiki)

---

<div align="center">

**Feito com ❤️ pela comunidade Home Buddy**

⭐ **Deixe uma estrela se este projeto te ajudou!**

[🌟 GitHub](https://github.com/offreflix/home-buddy) • [📱 Demo](https://homebuddy.com) • [📧 Newsletter](https://homebuddy.com/newsletter)

</div>
