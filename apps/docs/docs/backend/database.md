# Banco de Dados

O Home Buddy utiliza PostgreSQL como banco de dados principal, com Prisma como ORM para gerenciamento de dados e migrações.

## Visão Geral

- **Banco**: PostgreSQL
- **ORM**: Prisma
- **Migrações**: Prisma Migrate
- **Seeds**: Scripts de população inicial
- **Conexão**: Pool de conexões configurável

## Schema do Banco

### Modelo de Dados

```mermaid
erDiagram
    User ||--o{ Product : owns
    User ||--o{ OperationLog : performs
    Category ||--o{ Product : categorizes
    Product ||--o| Stock : has
    Product ||--o{ StockMovement : tracks
    Stock ||--o{ StockMovement : records
    OperationLog ||--o| ScrapingLog : logs
    OperationLog ||--o| MatchingLog : logs
    OperationLog ||--o{ LLMLog : logs

    User {
        int id PK
        string email UK
        string username UK
        string password
        string firstName
        string lastName
        string googleId UK
        string picture
        datetime lastLoginAt
        datetime createdAt
        datetime updatedAt
    }

    Category {
        int id PK
        string name UK
        datetime createdAt
        datetime updatedAt
    }

    Product {
        int id PK
        string name
        string description
        int categoryId FK
        int userId FK
        enum unit
        datetime createdAt
        datetime updatedAt
    }

    Stock {
        int id PK
        int productId FK UK
        float currentQuantity
        float desiredQuantity
        datetime updatedAt
    }

    StockMovement {
        int id PK
        int productId FK
        int stockId FK
        enum movementType
        float quantity
        string description
        datetime createdAt
        datetime updatedAt
    }

    OperationLog {
        int id PK
        string jobId UK
        int userId FK
        enum operationType
        enum status
        datetime startTime
        datetime endTime
        int duration
        string errorMessage
        json metadata
        datetime createdAt
        datetime updatedAt
    }

    ScrapingLog {
        int id PK
        int operationId FK UK
        string url
        json inputData
        json outputData
        int httpStatus
        int responseTime
        json errorDetails
        datetime createdAt
    }

    MatchingLog {
        int id PK
        int operationId FK UK
        json inputProducts
        json matcherRequest
        json matcherResponse
        int matchCount
        int unmatchCount
        int responseTime
        json errorDetails
        datetime createdAt
    }

    LLMLog {
        int id PK
        int operationId FK
        string provider
        string model
        string prompt
        string response
        int promptTokens
        int responseTokens
        int totalTokens
        float cost
        float temperature
        int responseTime
        json errorDetails
        datetime createdAt
    }
```

## Configuração do Prisma

### Schema Principal

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            Int            @id @default(autoincrement())
  email         String         @unique
  password      String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  username      String         @unique
  firstName     String?
  googleId      String?        @unique
  lastName      String?
  picture       String?
  lastLoginAt   DateTime?
  operationLogs OperationLog[]
  products      Product[]
}

model Category {
  id        Int       @id @default(autoincrement())
  name      String    @unique
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  products  Product[]
}

model Product {
  id          Int             @id @default(autoincrement())
  name        String
  description String?
  createdAt   DateTime        @default(now())
  categoryId  Int
  userId      Int
  updatedAt   DateTime        @updatedAt
  unit        Unit            @default(unidade)
  category    Category        @relation(fields: [categoryId], references: [id])
  user        User            @relation(fields: [userId], references: [id])
  stock       Stock?
  movements   StockMovement[]
}

model Stock {
  id              Int             @id @default(autoincrement())
  productId       Int             @unique
  updatedAt       DateTime        @updatedAt
  currentQuantity Float           @default(0)
  desiredQuantity Float
  product         Product         @relation(fields: [productId], references: [id])
  movements       StockMovement[]
}

model StockMovement {
  id           Int          @id @default(autoincrement())
  productId    Int
  movementType MovementType
  quantity     Float
  description  String?
  createdAt    DateTime     @default(now())
  stockId      Int?
  updatedAt    DateTime     @updatedAt
  product      Product      @relation(fields: [productId], references: [id])
  Stock        Stock?       @relation(fields: [stockId], references: [id])

  @@index([productId])
}

model OperationLog {
  id            Int             @id @default(autoincrement())
  jobId         String          @unique
  userId        Int?
  operationType OperationType
  status        OperationStatus @default(RUNNING)
  startTime     DateTime        @default(now())
  endTime       DateTime?
  duration      Int?
  errorMessage  String?
  metadata      Json?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  llmLogs       LLMLog[]
  matchingLog   MatchingLog?
  user          User?           @relation(fields: [userId], references: [id])
  scrapingLog   ScrapingLog?

  @@index([jobId])
  @@index([userId])
  @@index([operationType])
  @@index([status])
}

model ScrapingLog {
  id           Int          @id @default(autoincrement())
  operationId  Int          @unique
  url          String
  inputData    Json
  outputData   Json?
  httpStatus   Int?
  responseTime Int?
  errorDetails Json?
  createdAt    DateTime     @default(now())
  operation    OperationLog @relation(fields: [operationId], references: [id], onDelete: Cascade)
}

model MatchingLog {
  id              Int          @id @default(autoincrement())
  operationId     Int          @unique
  inputProducts   Json
  matcherRequest  Json
  matcherResponse Json?
  matchCount      Int?
  unmatchCount    Int?
  responseTime    Int?
  errorDetails    Json?
  createdAt       DateTime     @default(now())
  operation       OperationLog @relation(fields: [operationId], references: [id], onDelete: Cascade)
}

model LLMLog {
  id             Int          @id @default(autoincrement())
  operationId    Int
  provider       String       @default("openai")
  model          String
  prompt         String
  response       String?
  promptTokens   Int?
  responseTokens Int?
  totalTokens    Int?
  cost           Float?
  temperature    Float?
  responseTime   Int?
  errorDetails   Json?
  createdAt      DateTime     @default(now())
  operation      OperationLog @relation(fields: [operationId], references: [id], onDelete: Cascade)

  @@index([operationId])
  @@index([provider])
  @@index([model])
}

enum MovementType {
  IN
  OUT
}

enum Unit {
  kg
  g
  L
  lata
  pacote
  unidade
}

enum OperationType {
  SCRAPING_ONLY
  SCRAPING_MATCHING
  MATCHING_ONLY
}

enum OperationStatus {
  RUNNING
  COMPLETED
  FAILED
  CANCELLED
}
```

## Prisma Service

### Implementação Base

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
```

### Configuração de Conexão

```typescript
// prisma.module.ts
import { Module, Global } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

## Migrações

### Comandos de Migração

```bash
# Criar nova migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações pendentes
npx prisma migrate deploy

# Reset do banco (desenvolvimento)
npx prisma migrate reset

# Status das migrações
npx prisma migrate status
```

### Exemplo de Migração

```sql
-- Migration: 20250201033441_init
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "firstName" TEXT,
    "googleId" TEXT,
    "lastName" TEXT,
    "picture" TEXT,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
```

## Seeds

### Script de Seed

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Criar categorias padrão
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Cereais' },
      update: {},
      create: { name: 'Cereais' },
    }),
    prisma.category.upsert({
      where: { name: 'Legumes' },
      update: {},
      create: { name: 'Legumes' },
    }),
    prisma.category.upsert({
      where: { name: 'Frutas' },
      update: {},
      create: { name: 'Frutas' },
    }),
    prisma.category.upsert({
      where: { name: 'Carnes' },
      update: {},
      create: { name: 'Carnes' },
    }),
    prisma.category.upsert({
      where: { name: 'Laticínios' },
      update: {},
      create: { name: 'Laticínios' },
    }),
  ])

  console.log('Categorias criadas:', categories)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### Executar Seed

```bash
# Executar seed
npx prisma db seed

# Ou diretamente
npx ts-node prisma/seed.ts
```

## Operações de Banco

### Transações

```typescript
// Exemplo de transação
async createProduct(createProductDto: CreateProductDto, user: UserEntity) {
  return await this.prisma.$transaction(async (trx) => {
    // Verificar se categoria existe
    const categoryExists = await trx.category.findFirst({
      where: { id: createProductDto.categoryId },
    });

    if (!categoryExists) {
      throw new UnprocessableEntityException('Categoria não encontrada.');
    }

    // Verificar se produto já existe
    const productExists = await trx.product.findFirst({
      where: { name: createProductDto.name, userId: user.id },
    });

    if (productExists) {
      throw new UnprocessableEntityException('Já existe um produto com o mesmo nome.');
    }

    // Criar produto
    const product = await trx.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        unit: createProductDto.unit,
        category: { connect: { id: createProductDto.categoryId } },
        user: { connect: { id: user.id } },
      },
      include: { category: true },
    });

    // Criar estoque
    const stock = await trx.stock.create({
      data: {
        product: { connect: { id: product.id } },
        currentQuantity: createProductDto.currentQuantity,
        desiredQuantity: createProductDto.desiredQuantity,
      },
    });

    return { ...product, stock };
  });
}
```

### Queries Complexas

```typescript
// Produto mais consumido com comparação mensal
async mostConsumed(dto: MostConsumedDto, user: UserEntity) {
  const { month, year } = dto;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  return await this.prisma.$transaction(async (trx) => {
    // Buscar produto mais consumido no mês
    const mostConsumed = await trx.stockMovement.groupBy({
      by: ['productId'],
      where: {
        movementType: 'OUT',
        createdAt: { gte: startDate, lt: endDate },
        product: { userId: user.id },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 1,
    });

    if (mostConsumed.length === 0) {
      return [];
    }

    const productId = mostConsumed[0].productId;
    const currentMonthTotal = mostConsumed[0]._sum.quantity || 0;

    // Calcular mês anterior
    const prevMonthDate = new Date(year, month - 2, 1);
    const prevStartDate = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth(), 1);
    const prevEndDate = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth() + 1, 1);

    // Consumo do mês anterior
    const prevMonthConsumed = await trx.stockMovement.aggregate({
      where: {
        productId,
        movementType: 'OUT',
        createdAt: { gte: prevStartDate, lt: prevEndDate },
      },
      _sum: { quantity: true },
    });

    const previousMonthTotal = prevMonthConsumed._sum.quantity || 0;

    // Calcular percentual de mudança
    let percentageChange = 0;
    if (previousMonthTotal !== 0) {
      percentageChange = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
    } else if (currentMonthTotal > 0) {
      percentageChange = 100;
    }

    // Buscar dados do produto
    const product = await trx.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });

    return {
      product: product.name,
      quantity: currentMonthTotal,
      unit: product.unit,
      percentageChange: Number(percentageChange.toFixed(2)),
    };
  });
}
```

### Paginação

```typescript
// Implementação de paginação
async findAll(user: UserEntity, query: PaginationQueryDto, req: Request) {
  const paginationOptions = this.paginationService.createPaginationOptions(query);

  const total = await this.prisma.product.count({
    where: { userId: user.id },
  });

  // Configurar ordenação especial para campos aninhados
  let orderBy: any = {};

  switch (paginationOptions.sortBy) {
    case 'stock.currentQuantity':
      orderBy = { stock: { currentQuantity: paginationOptions.sortOrder } };
      break;
    case 'category.name':
      orderBy = { category: { name: paginationOptions.sortOrder } };
      break;
    default:
      orderBy = { [paginationOptions.sortBy]: paginationOptions.sortOrder };
  }

  const products = await this.prisma.product.findMany({
    where: { userId: user.id },
    include: { category: true, stock: true, movements: true },
    skip: (paginationOptions.page - 1) * paginationOptions.perPage,
    take: paginationOptions.perPage,
    orderBy,
  });

  return this.paginationService.createPaginatedResponse(
    products,
    total,
    paginationOptions,
    req,
  );
}
```

## Índices e Performance

### Índices Criados

```sql
-- Índices para performance
CREATE INDEX "StockMovement_productId_idx" ON "StockMovement"("productId");
CREATE INDEX "OperationLog_jobId_idx" ON "OperationLog"("jobId");
CREATE INDEX "OperationLog_userId_idx" ON "OperationLog"("userId");
CREATE INDEX "OperationLog_operationType_idx" ON "OperationLog"("operationType");
CREATE INDEX "OperationLog_status_idx" ON "OperationLog"("status");
CREATE INDEX "LLMLog_operationId_idx" ON "LLMLog"("operationId");
CREATE INDEX "LLMLog_provider_idx" ON "LLMLog"("provider");
CREATE INDEX "LLMLog_model_idx" ON "LLMLog"("model");
```

### Otimizações de Query

```typescript
// Query otimizada com select específico
async countByCategory(user: UserEntity) {
  const categories = await this.prisma.category.findMany({
    where: {
      products: {
        some: { userId: user.id },
      },
    },
    select: {
      name: true,
      _count: {
        select: { products: true },
      },
    },
  });

  return categories.map((category) => ({
    name: category.name,
    count: category._count.products,
  }));
}
```

## Backup e Restore

### Backup

```bash
# Backup completo
pg_dump -h localhost -U username -d home_buddy > backup.sql

# Backup apenas dados
pg_dump -h localhost -U username -d home_buddy --data-only > data_backup.sql

# Backup apenas schema
pg_dump -h localhost -U username -d home_buddy --schema-only > schema_backup.sql
```

### Restore

```bash
# Restore completo
psql -h localhost -U username -d home_buddy < backup.sql

# Restore apenas dados
psql -h localhost -U username -d home_buddy < data_backup.sql
```

## Monitoramento

### Health Check

```typescript
// health.controller.ts
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get('database')
  async checkDatabase() {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return { status: 'healthy', database: 'connected' }
    } catch (error) {
      return {
        status: 'unhealthy',
        database: 'disconnected',
        error: error.message,
      }
    }
  }
}
```

### Logs de Query

```typescript
// prisma.service.ts
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    })
  }

  async onModuleInit() {
    this.$on('query', (e) => {
      console.log('Query: ' + e.query)
      console.log('Params: ' + e.params)
      console.log('Duration: ' + e.duration + 'ms')
    })

    await this.$connect()
  }
}
```

## Configuração de Ambiente

### Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/home_buddy?schema=public"

# Pool de conexões
DATABASE_POOL_SIZE=10
DATABASE_POOL_TIMEOUT=20000
DATABASE_POOL_IDLE_TIMEOUT=30000
```

### Docker Compose

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: home_buddy
      POSTGRES_USER: username
      POSTGRES_PASSWORD: password
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  postgres_data:
```
