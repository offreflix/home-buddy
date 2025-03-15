# Home Buddy

Um aplicativo moderno em monorepositório construído com Next.js e NestJS, apresentando autenticação robusta e arquitetura de microsserviços.

## 🚀 Tecnologias Utilizadas

### Frontend

- **Next.js 14** - Framework React com renderização do lado do servidor
- **TypeScript** - Verificação estática de tipos
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Biblioteca de componentes reutilizáveis
- **React Query** - Busca e cache de dados
- **React Hook Form** - Manipulação de formulários
- **Zod** - Validação de esquemas

### Backend

- **NestJS** - Framework progressivo para Node.js
- **TypeScript** - Verificação estática de tipos
- **PostgreSQL** - Banco de dados principal
- **Redis** - Gerenciamento de sessões e cache
- **Prisma** - ORM para operações de banco de dados
- **JWT** - Autenticação baseada em tokens

## 🏗️ Arquitetura

O projeto segue uma estrutura de monorepositório utilizando Yarn workspaces:

```plaintext
home-buddy-monorepo/

├── apps/

│   ├── frontend/    # Aplicação Next.js

│   └── backend/     # Aplicação NestJS

└── packages/        # Pacotes compartilhados
```

## 🔐 Fluxo de Autenticação

###### 1. Registro

- Usuário se registra com nome de usuário, e-mail e senha
- A senha é hashada usando bcrypt
- Tokens JWT (access e refresh) são gerados

###### 2. Login

- Usuário fornece credenciais
- Sistema valida e retorna tokens JWT
- Tokens são armazenados em cookies HTTP-only

###### 3. Gerenciamento de Tokens

- **Access Token**: Validade de 15 minutos
- **Refresh Token**: Validade de 7 dias
- Redis armazena tokens ativos para validação

###### 4. Recursos de Segurança

- Cookies HTTP-only
- Validação de tokens JWT
- Lista negra de tokens no Redis
- Proteção de rotas usando Guards

## 🛠️ Configuração e Instalação

### 📌 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js 20+
- Yarn 4.6.0+
- Docker e Docker Compose
- PostgreSQL 15+ (configure manualmente se não usar Docker)
- Redis 7+ (configure manualmente se não usar Docker)

### 🚀 Passo a Passo

#### 1. Clone o repositório:

```shell
git clone https://github.com/offreflix/home-buddy
cd home-buddy-monorepo
```

#### 2. Instale as dependências:

```shell
yarn install
```

#### 3. Inicie os serviços com Docker:

```shell
docker-compose up -d
```

Isso iniciará:

- **PostgreSQL** na porta **5432**
- **Redis** na porta **6379**
- Backend **(NestJS)** na porta **3000**
- Frontend **(Next.js)** na porta **5173**

#### 4. Execute as migrações do Prisma:

```shell
docker exec -it home-buddy-backend yarn prisma migrate deploy
```

#### 5. Acesse a aplicação:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
