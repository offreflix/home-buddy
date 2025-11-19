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

---

## 🏗️ Arquitetura da Aplicação

```
home-buddy-monorepo/
├── apps/
│   ├── frontend/          # 🖥️  Interface Web (Next.js)
│   ├── backend/           # 🚀 API Principal (NestJS)
│   └── matcher/           # 🤖 Serviço de IA (FastAPI)
├── packages/              # 📦 Componentes Compartilhados
│   ├── eslint-config/
│   ├── typescript-config/
│   └── ui/                # 🎨 Biblioteca de UI
└── docker-compose.yml     # 🐳 Orquestração de Serviços
```

### 🛠️ Stack Tecnológica

#### Frontend (Next.js)

- **Framework**: Next.js 15.1.5 com App Router
- **Linguagem**: TypeScript 5.x
- **UI/UX**: Tailwind CSS + Shadcn/ui + Radix UI
- **Estado**: Zustand + React Query (TanStack)
- **Formulários**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Tema**: next-themes (Dark/Light mode)

#### Backend (NestJS)

- **Framework**: NestJS 10.x
- **Linguagem**: TypeScript 5.x
- **Banco**: PostgreSQL 15+ com Prisma ORM
- **Cache/Sessões**: Redis 7+
- **Autenticação**: JWT + Google OAuth 2.0
- **Filas**: BullMQ para processamento assíncrono
- **Documentação**: Swagger/OpenAPI

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
- **Monorepo**: Yarn Workspaces + Turbo

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

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Documentação API**: http://localhost:3000/api

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

| Serviço        | Porta | Descrição             |
| -------------- | ----- | --------------------- |
| **Frontend**   | 5173  | Interface web Next.js |
| **Backend**    | 3000  | API NestJS            |
| **Matcher**    | 8000  | Serviço de IA FastAPI |
| **PostgreSQL** | 5432  | Banco de dados        |
| **Redis**      | 6379  | Cache e sessões       |

---

## 📖 Guia de Uso

### 🎯 Primeiros Passos

1. **Acesse** http://localhost:5173
2. **Registre-se** ou faça login com Google
3. **Crie categorias** para seus produtos
4. **Adicione produtos** ao seu catálogo
5. **Configure estoques** desejados

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
curl -X POST http://localhost:3000/scrapping/queue \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://exemplo.com/nota-fiscal",
    "userId": "user123"
  }'
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
- Custo total com OpenAI
- Taxa de sucesso de matching
- Performance do scraping

#### Consultar Estatísticas

```bash
# Custos da última semana
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/tracking/llm-costs?days=7"

# Operações em andamento
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/tracking/running"
```

---

## 🔌 API Reference

### Autenticação

```
POST /auth/login       - Login tradicional
POST /auth/register    - Registro de usuário
GET  /auth/google      - Login com Google
POST /auth/refresh     - Refresh token
POST /auth/logout      - Logout
```

### Produtos

```
GET    /products              - Listar produtos
POST   /products              - Criar produto
GET    /products/:id          - Buscar produto
PUT    /products/:id          - Atualizar produto
DELETE /products/:id          - Deletar produto
POST   /products/:id/stock    - Atualizar estoque
```

### Scraping

```
GET    /scrapping?url=...           - Scraping síncrono
POST   /scrapping/queue             - Scraping assíncrono
POST   /scrapping/queue/multiple    - Múltiplos scrapings
GET    /scrapping/queue/status/:id  - Status do job
GET    /scrapping/queue/stats       - Estatísticas da fila
```

### Tracking

```
GET    /tracking/operations         - Histórico de operações
GET    /tracking/operations/:id     - Detalhes da operação
GET    /tracking/stats              - Estatísticas gerais
GET    /tracking/llm-costs         - Custos com IA
GET    /tracking/running           - Operações ativas
GET    /tracking/failed            - Operações com erro
```

### Categorias

```
GET    /categories       - Listar categorias
POST   /categories       - Criar categoria
PUT    /categories/:id   - Atualizar categoria
DELETE /categories/:id   - Deletar categoria
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
  "/tracking/llm-costs?days=7"

# Investigar operação específica
curl -H "Authorization: Bearer <token>" \
  "/tracking/operations/job-12345"

# Estatísticas gerais
curl -H "Authorization: Bearer <token>" \
  "/tracking/stats?period=month"
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
