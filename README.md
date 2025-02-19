# Home Buddy

A modern monorepo application built with Next.js and NestJS, featuring robust authentication and microservices architecture.

## 🚀 Tech Stack

### Frontend

- **Next.js 14** - React framework with server-side rendering
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Reusable component library
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Static type checking
- **PostgreSQL** - Primary database
- **Redis** - Session management and caching
- **Prisma** - ORM for database operations
- **JWT** - Token-based authentication

## 🏗️ Architecture

The project follows a monorepo structure using Yarn workspaces:

```plaintext

home-buddy-monorepo/

├── apps/

│   ├── frontend/    # Next.js application

│   └── backend/     # NestJS application

└── packages/        # Shared packages
```

## 🔐 Authentication Flow

###### 1. Registration

- User registers with username, email, and password
- Password is hashed using bcrypt
- JWT tokens (access + refresh) are generated

###### 2. Login

- User provides credentials
- System validates and returns JWT tokens
- Tokens are stored in HTTP-only cookies

###### 3. Token Management

- Access Token: 15 minutes validity
- Refresh Token: 7 days validity
- Redis stores active tokens for validation

###### 4. Security Features

- HTTP-only cookies
- JWT token validation
- Redis token blacklisting
- Route protection using Guards

## 🛠️ Setup e Instalação

### 📌 Pré-requisitos

Antes de iniciar, certifique-se de ter os seguintes requisitos instalados:

- Node.js 20+
- Yarn 4.6.0+
- Docker e Docker Compose
- PostgreSQL 15+ (caso não utilize Docker, precisa configurar manualmente)
- Redis 7+ (caso não utilize Docker, precisa configurar manualmente)

### 🚀 Passo a Passo para Configuração

#### 1. Clone o repositório:

```shell
git clone https://github.com/offreflix/home-buddy
cd home-buddy-monorepo
```

#### 2. Instale as dependências:

```shell
yarn install
```

#### 3. Suba os serviços do banco de dados e cache com Docker:

```shell
docker-compose up -d
```

Isso iniciará:

- **PostgreSQL** na porta **5432**
- **Redis** na porta **6379**
- Backend **(NestJS)** na porta **3000**
- Frontend **(Next.js)** na porta **5173**

#### 4. Rodar as migrações do Prisma (caso esteja usando Prisma para gerenciar o banco de dados):

```shell
docker exec -it home-buddy-backend yarn prisma migrate deploy
```

#### 5. Acesse a aplicação:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
