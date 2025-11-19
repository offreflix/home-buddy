# 📄 Exemplo de Implementação de Paginação

Este documento mostra como implementar paginação em qualquer endpoint usando o sistema genérico criado.

## 🚀 Implementação Básica

### 1. Controller

```typescript
import { Controller, Get, Query, Req } from '@nestjs/common';
import {
  PaginationQueryDto,
  PaginatedResponseDto,
} from 'src/common/dto/pagination.dto';
import { Request } from 'express';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
    @Req() req: Request,
  ): Promise<PaginatedResponseDto<any>> {
    return this.exampleService.findAll(query, req);
  }
}
```

### 2. Service

```typescript
import { Injectable } from '@nestjs/common';
import {
  PaginationQueryDto,
  PaginationResult,
} from 'src/common/dto/pagination.dto';
import { PaginationService } from 'src/common/services/pagination.service';
import { Request } from 'express';

@Injectable()
export class ExampleService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async findAll(
    query: PaginationQueryDto,
    req: Request,
  ): Promise<PaginationResult<any>> {
    const paginationOptions =
      this.paginationService.createPaginationOptions(query);

    // Contar total de registros
    const total = await this.prisma.example.count({
      where: {
        /* seus filtros aqui */
      },
    });

    // Buscar dados com paginação
    const data = await this.prisma.example.findMany({
      where: {
        /* seus filtros aqui */
      },
      include: {
        /* seus includes aqui */
      },
      ...this.paginationService.getPrismaPaginationOptions(paginationOptions),
    });

    return this.paginationService.createPaginatedResponse(
      data,
      total,
      paginationOptions,
      req,
    );
  }
}
```

### 3. Module

```typescript
import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ExampleController],
  providers: [ExampleService, PrismaService],
})
export class ExampleModule {}
```

## 🎨 Implementação no Frontend

### 1. Tipos

```typescript
// types/example.type.ts
export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  from: number;
  to: number;
}

export interface PaginationLinks {
  self: string;
  next: string | null;
  prev: string | null;
  first: string;
  last: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

### 2. Model/Hook

```typescript
// hooks/useExampleModel.ts
export const useExampleModel = () => {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    perPage: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const query = useQuery({
    queryKey: ['examples', pagination],
    queryFn: () =>
      apiClient
        .get('/examples', { params: pagination })
        .then((res) => res.data),
  });

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePerPageChange = (perPage: number) => {
    setPagination((prev) => ({ ...prev, perPage, page: 1 }));
  };

  const handleSortingChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setPagination((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }));
  };

  return {
    query,
    pagination: query.data?.meta,
    paginationLinks: query.data?.links,
    handlePageChange,
    handlePerPageChange,
    handleSortingChange,
  };
};
```

### 3. Componente

```typescript
// components/ExampleList.tsx
export function ExampleList() {
  const { query, pagination, handlePageChange, handlePerPageChange } = useExampleModel()

  if (query.isLoading) return <div>Carregando...</div>

  return (
    <div>
      {/* Lista de dados */}
      {query.data?.data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}

      {/* Paginação */}
      {pagination && (
        <Pagination
          meta={pagination}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      )}
    </div>
  )
}
```

## 🔧 Opções de Paginação

### Query Parameters Disponíveis

- `page`: Número da página (padrão: 1)
- `perPage`: Itens por página (padrão: 10, máximo: 100)
- `sortBy`: Campo para ordenação (padrão: 'createdAt')
- `sortOrder`: Direção da ordenação ('asc' ou 'desc', padrão: 'desc')

### Exemplos de Uso

```bash
# Página 1, 10 itens por página
GET /api/example

# Página 2, 20 itens por página
GET /api/example?page=2&perPage=20

# Ordenar por nome em ordem crescente
GET /api/example?sortBy=name&sortOrder=asc

# Retornar todas as categorias (perPage <= 0)
GET /api/example?perPage=0
```

## 📊 Resposta da API

```json
{
  "data": [
    // Array com os dados da página atual
  ],
  "meta": {
    "page": 1,
    "perPage": 10,
    "total": 95,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false,
    "from": 1,
    "to": 10
  },
  "links": {
    "self": "http://localhost:3000/api/example?page=1&perPage=10",
    "next": "http://localhost:3000/api/example?page=2&perPage=10",
    "prev": null,
    "first": "http://localhost:3000/api/example?page=1&perPage=10",
    "last": "http://localhost:3000/api/example?page=10&perPage=10"
  }
}
```

## 🎯 Casos Especiais

### Retornar Todos os Registros

Para endpoints que precisam retornar todos os registros (como dropdowns), use `perPage=0`:

```typescript
// No service
if (paginationOptions.perPage <= 0) {
  const allData = await this.prisma.example.findMany({
    orderBy: {
      [paginationOptions.sortBy]: paginationOptions.sortOrder,
    },
  });

  return {
    data: allData,
    meta: {
      page: 1,
      perPage: allData.length,
      total: allData.length,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      from: 1,
      to: allData.length,
    },
    links: {
      self: `${req.protocol}://${req.get('host')}${req.path}`,
      next: null,
      prev: null,
      first: `${req.protocol}://${req.get('host')}${req.path}`,
      last: `${req.protocol}://${req.get('host')}${req.path}`,
    },
  };
}
```

### Filtros Personalizados

```typescript
async findAll(
  query: PaginationQueryDto,
  filters: CustomFiltersDto,
  req: Request,
): Promise<PaginationResult<any>> {
  const paginationOptions = this.paginationService.createPaginationOptions(query);

  // Construir where clause com filtros
  const whereClause = {
    // Filtros básicos
    active: true,

    // Filtros de texto
    ...(filters.search && {
      OR: [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ],
    }),

    // Filtros de data
    ...(filters.startDate && filters.endDate && {
      createdAt: {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      },
    }),
  };

  const total = await this.prisma.example.count({ where: whereClause });

  const data = await this.prisma.example.findMany({
    where: whereClause,
    include: { /* seus includes */ },
    ...this.paginationService.getPrismaPaginationOptions(paginationOptions),
  });

  return this.paginationService.createPaginatedResponse(
    data,
    total,
    paginationOptions,
    req,
  );
}
```

## 🚨 Validações

O sistema já inclui validações automáticas:

- `page`: Deve ser positivo
- `perPage`: Deve estar entre 1 e 100
- `sortOrder`: Deve ser 'asc' ou 'desc'

## 🔄 Reutilização

Uma vez implementado, você pode facilmente adicionar paginação a outros endpoints:

1. Copie o padrão do controller
2. Copie o padrão do service
3. Importe o CommonModule no seu módulo
4. Pronto! Paginação funcionando

## 📝 Notas Importantes

- Sempre use `async/await` nos métodos
- Sempre retorne `Promise<PaginationResult<any>>`
- Sempre passe o `Request` object para o service
- O sistema funciona tanto com Prisma quanto com dados em memória
- Os links são gerados automaticamente baseados na URL atual
- No frontend, sempre use `query.data?.data` para acessar os dados
- A paginação é controlada pelo estado local, não pelo TanStack Table
