---
id: diagrams
title: Diagramas de Arquitetura
sidebar_position: 4
description: Diagramas visuais da arquitetura do Home Buddy
keywords: [diagramas, arquitetura, mermaid, fluxo, home buddy]
---

# 📊 Diagramas de Arquitetura

Esta seção contém diagramas visuais que ilustram a arquitetura e fluxos do sistema Home Buddy.

## 🏗️ Arquitetura Geral do Sistema

```mermaid
graph TB
    subgraph "Cliente"
        U[👤 Usuário]
        B[🌐 Navegador]
    end

    subgraph "Frontend Layer"
        F[⚛️ Next.js App<br/>Porta 3000]
        CDN[📦 CDN/Static Assets]
    end

    subgraph "API Gateway"
        LB[⚖️ Load Balancer]
    end

    subgraph "Backend Services"
        API[🔧 NestJS API<br/>Porta 3001]
        MATCHER[🤖 Python Matcher<br/>Porta 8000]
    end

    subgraph "Data Layer"
        PG[(🗄️ PostgreSQL)]
        REDIS[(⚡ Redis)]
        FILES[📁 File Storage]
    end

    subgraph "External Services"
        GOOGLE[🔐 Google OAuth]
        SUPABASE[☁️ Supabase]
        SCRAPING[🕷️ Web Scraping]
    end

    U --> B
    B --> F
    F --> CDN
    F --> LB
    LB --> API
    LB --> MATCHER
    API --> PG
    API --> REDIS
    MATCHER --> PG
    API --> GOOGLE
    API --> SUPABASE
    MATCHER --> SCRAPING
    API --> FILES
```

## 🔄 Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant U as 👤 Usuário
    participant F as ⚛️ Frontend
    participant B as 🔧 Backend
    participant G as 🔐 Google OAuth
    participant DB as 🗄️ Database

    U->>F: 1. Clica em "Login"
    F->>G: 2. Redirect para Google
    G->>U: 3. Tela de login Google
    U->>G: 4. Insere credenciais
    G->>F: 5. Retorna auth code
    F->>B: 6. POST /auth/google
    Note over F,B: { code, redirect_uri }
    B->>G: 7. Valida token
    G->>B: 8. User info + access_token
    B->>DB: 9. Create/Update user
    B->>F: 10. JWT token + user data
    F->>U: 11. Usuário autenticado
```

## 📦 Fluxo de Adição de Produto

```mermaid
sequenceDiagram
    participant U as 👤 Usuário
    participant F as ⚛️ Frontend
    participant B as 🔧 Backend
    participant M as 🤖 Matcher
    participant DB as 🗄️ Database
    participant Q as 📋 Queue
    participant WS as 🔌 WebSocket

    U->>F: 1. Adiciona produto
    F->>B: 2. POST /products
    Note over F,B: { name, url, category }
    B->>DB: 3. Salva produto
    B->>Q: 4. Adiciona job de matching
    B->>F: 5. Produto criado (ID)
    F->>U: 6. Confirmação visual

    Note over Q,M: Processamento assíncrono
    Q->>M: 7. Processa job
    M->>DB: 8. Busca produtos similares
    M->>DB: 9. Salva matches encontrados
    M->>B: 10. Notifica conclusão
    B->>WS: 11. Broadcast update
    WS->>F: 12. Atualiza UI em tempo real
    F->>U: 13. Mostra matches encontrados
```

## 🏢 Estrutura do Monorepo

```mermaid
graph TD
    subgraph "home-buddy-monorepo"
        subgraph "📁 apps/"
            F[⚛️ frontend/<br/>Next.js App]
            B[🔧 backend/<br/>NestJS API]
            M[🤖 matcher/<br/>Python FastAPI]
            D[📚 docs/<br/>Docusaurus]
        end

        subgraph "📦 packages/"
            UI[🎨 ui/<br/>Componentes]
            ESLINT[⚙️ eslint-config/<br/>Configurações]
            TS[📝 typescript-config/<br/>Configurações]
        end

        subgraph "🔧 Configurações"
            TURBO[⚡ turbo.json]
            YARN[📦 package.json]
            DOCKER[🐳 docker-compose.yml]
        end
    end

    F --> UI
    F --> ESLINT
    F --> TS
    B --> ESLINT
    B --> TS
    D --> ESLINT
    D --> TS
```

## 🔧 Arquitetura Interna do Backend

```mermaid
graph TB
    subgraph "🔧 Backend Service (NestJS)"
        subgraph "📁 Modules"
            AUTH[🔐 Auth Module]
            PROD[📦 Products Module]
            USER[👤 Users Module]
            CAT[📂 Categories Module]
            STOCK[📊 Stocks Module]
            TRACK[📈 Tracking Module]
            SCRAP[🕷️ Scrapping Module]
        end

        subgraph "🗄️ Data Layer"
            PRISMA[🔧 Prisma ORM]
            PG[(PostgreSQL)]
            REDIS[(Redis Cache)]
        end

        subgraph "📋 Queue System"
            BULL[Bull Queue]
            JOBS[Background Jobs]
        end

        subgraph "🌐 External APIs"
            GOOGLE[Google OAuth]
            SUPABASE[Supabase]
        end
    end

    AUTH --> PRISMA
    PROD --> PRISMA
    USER --> PRISMA
    CAT --> PRISMA
    STOCK --> PRISMA
    TRACK --> PRISMA
    SCRAP --> PRISMA

    PRISMA --> PG
    AUTH --> REDIS
    PROD --> REDIS

    PROD --> BULL
    SCRAP --> BULL
    BULL --> JOBS

    AUTH --> GOOGLE
    PROD --> SUPABASE
```

## 🤖 Arquitetura do Matcher Service

```mermaid
graph TB
    subgraph "🤖 Matcher Service (FastAPI)"
        subgraph "🔌 API Endpoints"
            MATCH[🔍 /match]
            SCRAPE[🕷️ /scrape]
            ANALYZE[📊 /analyze]
        end

        subgraph "🧠 ML Pipeline"
            EXTRACT[🔍 Feature Extraction]
            SIMILAR[📐 Similarity Calculation]
            RANK[📈 Ranking Algorithm]
        end

        subgraph "📊 Data Processing"
            PANDAS[🐼 Pandas]
            NUMPY[🔢 NumPy]
            SKLEARN[🤖 scikit-learn]
        end

        subgraph "🌐 External"
            WEB[🌐 Web Scraping]
            APIS[📡 Product APIs]
        end
    end

    MATCH --> EXTRACT
    EXTRACT --> SIMILAR
    SIMILAR --> RANK
    RANK --> MATCH

    SCRAPE --> WEB
    ANALYZE --> PANDAS

    EXTRACT --> PANDAS
    SIMILAR --> NUMPY
    RANK --> SKLEARN

    WEB --> APIS
```

## 🔄 Fluxo de Matching de Produtos

```mermaid
flowchart TD
    START([👤 Usuário adiciona produto]) --> INPUT[📝 Input: Nome, URL, Categoria]
    INPUT --> VALIDATE{✅ Validação}
    VALIDATE -->|❌ Inválido| ERROR[❌ Erro de validação]
    VALIDATE -->|✅ Válido| SAVE[💾 Salvar no banco]
    SAVE --> QUEUE[📋 Adicionar à fila]
    QUEUE --> PROCESS[🔄 Processar job]
    PROCESS --> SCRAPE[🕷️ Web scraping]
    SCRAPE --> EXTRACT[🔍 Extrair features]
    EXTRACT --> SIMILAR[📐 Calcular similaridade]
    SIMILAR --> RANK[📈 Rankear matches]
    RANK --> SAVE_MATCHES[💾 Salvar matches]
    SAVE_MATCHES --> NOTIFY[🔔 Notificar frontend]
    NOTIFY --> UPDATE[🔄 Atualizar UI]
    UPDATE --> END([✅ Processo concluído])

    ERROR --> END
```

## 📊 Fluxo de Dados do Sistema

```mermaid
graph LR
    subgraph "📥 Input"
        USER[👤 Usuário]
        WEB[🌐 Web Scraping]
        API[📡 External APIs]
    end

    subgraph "⚛️ Frontend"
        UI[🎨 Interface]
        STATE[📊 Estado]
        AUTH[🔐 Autenticação]
    end

    subgraph "🔧 Backend"
        API_REST[🌐 REST API]
        QUEUES[📋 Filas]
        CACHE[⚡ Cache]
    end

    subgraph "🤖 Matcher"
        ML[🧠 Machine Learning]
        PROCESS[⚙️ Processamento]
    end

    subgraph "🗄️ Storage"
        DB[(PostgreSQL)]
        REDIS[(Redis)]
        FILES[📁 Arquivos]
    end

    USER --> UI
    UI --> STATE
    STATE --> AUTH
    AUTH --> API_REST

    WEB --> API_REST
    API --> API_REST

    API_REST --> QUEUES
    API_REST --> CACHE
    QUEUES --> PROCESS
    PROCESS --> ML

    API_REST --> DB
    CACHE --> REDIS
    ML --> DB
    PROCESS --> FILES
```

## 🚀 Deploy e Infraestrutura

```mermaid
graph TB
    subgraph "🌐 Production Environment"
        subgraph "🔀 Load Balancer"
            LB[⚖️ Nginx/HAProxy]
        end

        subgraph "📦 Application Layer"
            F1[⚛️ Frontend 1]
            F2[⚛️ Frontend 2]
            B1[🔧 Backend 1]
            B2[🔧 Backend 2]
            M1[🤖 Matcher 1]
            M2[🤖 Matcher 2]
        end

        subgraph "🗄️ Data Layer"
            PG_MASTER[(PostgreSQL Master)]
            PG_SLAVE[(PostgreSQL Slave)]
            REDIS_CLUSTER[(Redis Cluster)]
        end

        subgraph "📊 Monitoring"
            METRICS[📈 Prometheus]
            LOGS[📝 ELK Stack]
            ALERTS[🚨 AlertManager]
        end
    end

    LB --> F1
    LB --> F2
    LB --> B1
    LB --> B2

    B1 --> PG_MASTER
    B2 --> PG_MASTER
    M1 --> PG_MASTER
    M2 --> PG_MASTER

    PG_MASTER --> PG_SLAVE

    B1 --> REDIS_CLUSTER
    B2 --> REDIS_CLUSTER

    F1 --> METRICS
    F2 --> METRICS
    B1 --> METRICS
    B2 --> METRICS
    M1 --> METRICS
    M2 --> METRICS

    METRICS --> LOGS
    LOGS --> ALERTS
```

## 🔒 Fluxo de Segurança

```mermaid
sequenceDiagram
    participant U as 👤 Usuário
    participant F as ⚛️ Frontend
    participant B as 🔧 Backend
    participant DB as 🗄️ Database
    participant G as 🔐 Google OAuth

    Note over U,G: Autenticação Inicial
    U->>F: 1. Acessa app
    F->>B: 2. Verifica token
    B->>DB: 3. Valida sessão
    DB->>B: 4. Sessão válida/inválida

    alt Token inválido/expirado
        B->>F: 5a. Token inválido
        F->>G: 6a. Redirect para login
        G->>F: 7a. Novo token
        F->>B: 8a. Atualiza token
    else Token válido
        B->>F: 5b. Acesso autorizado
    end

    Note over U,G: Operações Seguras
    F->>B: 9. Request com token
    B->>DB: 10. Valida permissões
    DB->>B: 11. Permissões OK
    B->>F: 12. Response segura
```

## 📈 Métricas e Monitoramento

```mermaid
graph TB
    subgraph "📊 Application Metrics"
        RESPONSE[⏱️ Response Time]
        THROUGHPUT[📈 Throughput]
        ERRORS[❌ Error Rate]
        USERS[👥 Active Users]
    end

    subgraph "💻 System Metrics"
        CPU[🖥️ CPU Usage]
        MEMORY[🧠 Memory Usage]
        DISK[💾 Disk Usage]
        NETWORK[🌐 Network I/O]
    end

    subgraph "🗄️ Database Metrics"
        QUERIES[🔍 Query Performance]
        CONNECTIONS[🔗 Connections]
        LOCKS[🔒 Lock Contention]
        SIZE[📏 Database Size]
    end

    subgraph "📈 Business Metrics"
        PRODUCTS[📦 Products Added]
        MATCHES[🔍 Matches Found]
        USERS_ACTIVE[👤 Active Users]
        REVENUE[💰 Revenue]
    end

    subgraph "📊 Monitoring Stack"
        PROMETHEUS[📈 Prometheus]
        GRAFANA[📊 Grafana]
        ELK[📝 ELK Stack]
        ALERTS[🚨 AlertManager]
    end

    RESPONSE --> PROMETHEUS
    THROUGHPUT --> PROMETHEUS
    ERRORS --> PROMETHEUS
    USERS --> PROMETHEUS

    CPU --> PROMETHEUS
    MEMORY --> PROMETHEUS
    DISK --> PROMETHEUS
    NETWORK --> PROMETHEUS

    QUERIES --> PROMETHEUS
    CONNECTIONS --> PROMETHEUS
    LOCKS --> PROMETHEUS
    SIZE --> PROMETHEUS

    PRODUCTS --> PROMETHEUS
    MATCHES --> PROMETHEUS
    USERS_ACTIVE --> PROMETHEUS
    REVENUE --> PROMETHEUS

    PROMETHEUS --> GRAFANA
    PROMETHEUS --> ELK
    PROMETHEUS --> ALERTS
```

## 📚 Próximos Passos

1. **[Backend API](/docs/backend/api-reference)** - Documentação completa da API
2. **[Frontend Components](/docs/frontend/components)** - Biblioteca de componentes
3. **[Deploy](/docs/deployment/docker)** - Guias de deploy

## 🆘 Precisa de Ajuda?

- **GitHub Issues**: [Reportar problemas](https://github.com/home-buddy/home-buddy-monorepo/issues)
- **Discord**: [Comunidade](https://discord.gg/home-buddy)
- **Email**: [suporte@homebuddy.com](mailto:suporte@homebuddy.com)
