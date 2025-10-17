# Guia de Estilo de Código

Este documento define os padrões de estilo de código para o projeto Home Buddy, garantindo consistência e legibilidade em todo o codebase.

## Visão Geral

O Home Buddy utiliza múltiplas tecnologias (TypeScript, Python, CSS) e cada uma tem suas próprias convenções de estilo. Este guia estabelece padrões consistentes para todas as tecnologias utilizadas.

## TypeScript/JavaScript

### Configuração Base

O projeto utiliza **ESLint** e **Prettier** para garantir consistência de código.

```json
// .eslintrc.js
module.exports = {
  extends: [
    '@home-buddy/eslint-config/base',
    '@home-buddy/eslint-config/react',
    '@home-buddy/eslint-config/next'
  ],
  rules: {
    // Regras específicas do projeto
  }
}
```

### Convenções de Nomenclatura

#### Variáveis e Funções

```typescript
// ✅ Correto - camelCase
const userName = 'john_doe'
const isAuthenticated = true
const getUserData = () => {}

// ❌ Incorreto
const user_name = 'john_doe'
const IsAuthenticated = true
const get_user_data = () => {}
```

#### Constantes

```typescript
// ✅ Correto - UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.homebuddy.com'
const MAX_RETRY_ATTEMPTS = 3
const DEFAULT_PAGE_SIZE = 20

// ❌ Incorreto
const apiBaseUrl = 'https://api.homebuddy.com'
const maxRetryAttempts = 3
```

#### Classes e Interfaces

```typescript
// ✅ Correto - PascalCase
class UserService {}
interface ProductData {}
type UserRole = 'admin' | 'user'

// ❌ Incorreto
class userService {}
interface productData {}
type userRole = 'admin' | 'user'
```

#### Arquivos e Pastas

```bash
# ✅ Correto - kebab-case
user-service.ts
product-card.tsx
auth-guard.ts
user-profile/
product-list/

# ❌ Incorreto
userService.ts
ProductCard.tsx
authGuard.ts
UserProfile/
ProductList/
```

### Estrutura de Arquivos

#### Componentes React

```typescript
// ✅ Estrutura recomendada
import React from 'react'
import { ComponentProps } from 'react'

// Types
interface ProductCardProps {
  product: Product
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
}

// Component
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete
}) => {
  // Hooks
  const [isEditing, setIsEditing] = useState(false)

  // Handlers
  const handleEdit = () => {
    setIsEditing(true)
    onEdit?.(product)
  }

  // Render
  return (
    <div className="product-card">
      {/* JSX */}
    </div>
  )
}

// Default export
export default ProductCard
```

#### Serviços NestJS

```typescript
// ✅ Estrutura recomendada
import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

// DTOs
interface CreateProductDto {
  name: string
  description?: string
  categoryId: number
}

// Service
@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name)

  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId: number) {
    try {
      this.logger.log(`Creating product: ${createProductDto.name}`)

      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          userId,
        },
      })

      this.logger.log(`Product created with ID: ${product.id}`)
      return product
    } catch (error) {
      this.logger.error(`Failed to create product: ${error.message}`)
      throw error
    }
  }
}
```

### Formatação

#### Indentação e Espaçamento

```typescript
// ✅ Correto - 2 espaços
function calculateTotal(items: Item[]) {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
}

// ❌ Incorreto - tabs ou 4 espaços
function calculateTotal(items: Item[]) {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
}
```

#### Quebras de Linha

```typescript
// ✅ Correto - quebras lógicas
const result = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(productData),
})

// ❌ Incorreto - linha muito longa
const result = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(productData),
})
```

#### Imports

```typescript
// ✅ Correto - ordem específica
// 1. Node modules
import React from 'react'
import { NextPage } from 'next'
import { useQuery } from '@tanstack/react-query'

// 2. Internal modules
import { ProductService } from '@/services/product.service'
import { ProductCard } from '@/components/product-card'

// 3. Relative imports
import './product-list.css'

// ❌ Incorreto - ordem aleatória
import { ProductCard } from '@/components/product-card'
import React from 'react'
import { ProductService } from '@/services/product.service'
import { NextPage } from 'next'
```

### Comentários

#### JSDoc para Funções

```typescript
/**
 * Calcula o total de produtos em estoque baixo
 * @param products - Lista de produtos
 * @param threshold - Limite para considerar estoque baixo
 * @returns Número de produtos com estoque baixo
 */
function getLowStockCount(products: Product[], threshold: number): number {
  return products.filter((product) => product.stock < threshold).length
}
```

#### Comentários Inline

```typescript
// ✅ Correto - explica o "por que", não o "o que"
// Usar cache para evitar múltiplas chamadas à API
const cachedProducts = useMemo(() => {
  return products.map((product) => ({
    ...product,
    // Converter preço para centavos para evitar problemas de precisão
    priceInCents: Math.round(product.price * 100),
  }))
}, [products])

// ❌ Incorreto - explica o óbvio
// Incrementar contador
counter++
```

### Tratamento de Erros

#### Try-Catch

```typescript
// ✅ Correto - tratamento específico
async function fetchProduct(id: string): Promise<Product> {
  try {
    const response = await api.get(`/products/${id}`)
    return response.data
  } catch (error) {
    if (error.response?.status === 404) {
      throw new ProductNotFoundError(`Product ${id} not found`)
    }
    if (error.response?.status === 403) {
      throw new UnauthorizedError('Access denied')
    }
    throw new ApiError('Failed to fetch product')
  }
}

// ❌ Incorreto - tratamento genérico
async function fetchProduct(id: string): Promise<Product> {
  try {
    const response = await api.get(`/products/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
```

#### Error Boundaries

```typescript
// ✅ Correto - Error Boundary
class ProductErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Product Error Boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}
```

## Python

### Configuração Base

O projeto utiliza **Black**, **isort** e **flake8** para formatação e linting.

```toml
# pyproject.toml
[tool.black]
line-length = 88
target-version = ['py311']

[tool.isort]
profile = "black"
multi_line_output = 3

[tool.flake8]
max-line-length = 88
extend-ignore = ["E203", "W503"]
```

### Convenções de Nomenclatura

#### Variáveis e Funções

```python
# ✅ Correto - snake_case
user_name = "john_doe"
is_authenticated = True
def get_user_data():
    pass

# ❌ Incorreto
userName = "john_doe"
IsAuthenticated = True
def getUserData():
    pass
```

#### Classes

```python
# ✅ Correto - PascalCase
class UserService:
    pass

class ProductData:
    pass

# ❌ Incorreto
class userService:
    pass

class productData:
    pass
```

#### Constantes

```python
# ✅ Correto - UPPER_SNAKE_CASE
API_BASE_URL = "https://api.homebuddy.com"
MAX_RETRY_ATTEMPTS = 3
DEFAULT_PAGE_SIZE = 20

# ❌ Incorreto
apiBaseUrl = "https://api.homebuddy.com"
maxRetryAttempts = 3
```

### Estrutura de Arquivos

#### FastAPI Services

```python
# ✅ Estrutura recomendada
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

# Models
class ProductScrap(BaseModel):
    title: str
    quantity: Optional[str] = None
    unit: Optional[str] = None

class MatchRequest(BaseModel):
    user_id: str
    products_scrap: List[ProductScrap]

# Router
router = APIRouter(prefix="/match", tags=["match"])

# Dependencies
def verify_internal_token(token: str = Header(alias="X-Service-Token")):
    if token != settings.internal_token:
        raise HTTPException(status_code=401, detail="Token inválido")
    return token

# Endpoints
@router.post("", response_model=MatchResponse)
async def match_products(
    payload: MatchRequest,
    token: str = Depends(verify_internal_token)
):
    """Match products using AI."""
    try:
        # Implementation
        pass
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Formatação

#### Indentação

```python
# ✅ Correto - 4 espaços
def calculate_total(items: List[Item]) -> float:
    return sum(
        item.price * item.quantity
        for item in items
        if item.is_active
    )

# ❌ Incorreto - tabs ou 2 espaços
def calculate_total(items: List[Item]) -> float:
	return sum(
		item.price * item.quantity
		for item in items
		if item.is_active
	)
```

#### Imports

```python
# ✅ Correto - ordem específica
# 1. Standard library
import os
from typing import List, Optional
from datetime import datetime

# 2. Third-party
import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# 3. Local imports
from .models import Product
from .services import ProductService

# ❌ Incorreto - ordem aleatória
from .services import ProductService
import httpx
from typing import List, Optional
import os
```

### Type Hints

```python
# ✅ Correto - type hints completos
def process_products(
    products: List[Product],
    user_id: int,
    threshold: float = 0.8
) -> Dict[str, Any]:
    """Process products and return results."""
    return {
        "processed": len(products),
        "user_id": user_id,
        "threshold": threshold
    }

# ❌ Incorreto - sem type hints
def process_products(products, user_id, threshold=0.8):
    return {
        "processed": len(products),
        "user_id": user_id,
        "threshold": threshold
    }
```

### Docstrings

```python
# ✅ Correto - docstring completa
def match_products(
    products_scrap: List[ProductScrap],
    user_products: List[Dict[str, Any]]
) -> MatchResult:
    """
    Match scraped products with user's existing products using AI.

    Args:
        products_scrap: List of products extracted from receipt
        user_products: List of user's existing products

    Returns:
        MatchResult containing matched and unmatched products

    Raises:
        ValueError: If products_scrap is empty
        APIError: If OpenAI API call fails
    """
    if not products_scrap:
        raise ValueError("products_scrap cannot be empty")

    # Implementation
    pass
```

### Tratamento de Erros

```python
# ✅ Correto - tratamento específico
async def fetch_user_products(user_id: str) -> List[Dict[str, Any]]:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{settings.backend_base_url}/products/internal/{user_id}",
                headers={"X-Service-Token": settings.internal_token}
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(404, "User not found")
        elif e.response.status_code == 403:
            raise HTTPException(403, "Access denied")
        else:
            raise HTTPException(500, "Backend service error")
    except httpx.RequestError as e:
        raise HTTPException(500, f"Network error: {str(e)}")
```

## CSS/Styling

### Tailwind CSS

#### Classes Utility-First

```tsx
// ✅ Correto - classes organizadas
<div className="
  flex flex-col items-center justify-center
  w-full max-w-md mx-auto
  p-6 bg-white rounded-lg shadow-md
  border border-gray-200
">
  <h1 className="text-2xl font-bold text-gray-900 mb-4">
    Product Card
  </h1>
  <p className="text-gray-600 text-center">
    Product description
  </p>
</div>

// ❌ Incorreto - classes desorganizadas
<div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
```

#### Responsive Design

```tsx
// ✅ Correto - mobile-first
<div
  className="
  grid grid-cols-1 gap-4
  sm:grid-cols-2 sm:gap-6
  md:grid-cols-3 md:gap-8
  lg:grid-cols-4
"
>
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

#### Custom Components

```tsx
// ✅ Correto - componente reutilizável
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
}) => {
  const baseClasses = 'font-medium rounded-md transition-colors'

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### CSS Modules (quando necessário)

```css
/* ✅ Correto - ProductCard.module.css */
.productCard {
  @apply flex flex-col p-4 bg-white rounded-lg shadow-md;
}

.productCard:hover {
  @apply shadow-lg transform scale-105 transition-all;
}

.title {
  @apply text-lg font-semibold text-gray-900 mb-2;
}

.description {
  @apply text-gray-600 text-sm;
}

.price {
  @apply text-xl font-bold text-green-600 mt-auto;
}
```

## Configurações de Ferramentas

### ESLint

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@home-buddy/eslint-config/base',
    '@home-buddy/eslint-config/react',
    '@home-buddy/eslint-config/next',
  ],
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',

    // React
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'warn',

    // General
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
  },
}
```

### Prettier

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### Black (Python)

```toml
# pyproject.toml
[tool.black]
line-length = 88
target-version = ['py311']
include = '\.pyi?$'
extend-exclude = '''
/(
  # directories
  \.eggs
  | \.git
  | \.hg
  | \.mypy_cache
  | \.tox
  | \.venv
  | build
  | dist
)/
'''
```

## Exemplos Práticos

### Componente React Completo

```tsx
import React, { useState, useCallback } from 'react'
import { Product } from '@/types/product'
import { Button } from '@/components/ui/button'
import { ProductCard } from './product-card'

interface ProductListProps {
  products: Product[]
  onProductEdit: (product: Product) => void
  onProductDelete: (productId: number) => void
  isLoading?: boolean
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductEdit,
  onProductDelete,
  isLoading = false,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product)
  }, [])

  const handleEdit = useCallback(
    (product: Product) => {
      onProductEdit(product)
      setSelectedProduct(null)
    },
    [onProductEdit],
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={selectedProduct?.id === product.id}
          onSelect={handleProductSelect}
          onEdit={handleEdit}
          onDelete={onProductDelete}
        />
      ))}
    </div>
  )
}
```

### Serviço NestJS Completo

```typescript
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProductDto, UpdateProductDto } from './dto'
import { Product } from '@prisma/client'

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name)

  constructor(private readonly prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    userId: number,
  ): Promise<Product> {
    try {
      this.logger.log(`Creating product: ${createProductDto.name}`)

      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          userId,
        },
        include: {
          category: true,
          stock: true,
        },
      })

      this.logger.log(`Product created with ID: ${product.id}`)
      return product
    } catch (error) {
      this.logger.error(`Failed to create product: ${error.message}`)
      throw error
    }
  }

  async findAll(userId: number): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { userId },
      include: {
        category: true,
        stock: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: number, userId: number): Promise<Product> {
    const product = await this.prisma.product.findFirst({
      where: { id, userId },
      include: {
        category: true,
        stock: true,
      },
    })

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`)
    }

    return product
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    userId: number,
  ): Promise<Product> {
    await this.findOne(id, userId) // Verifica se existe

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
        stock: true,
      },
    })
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.findOne(id, userId) // Verifica se existe

    await this.prisma.product.delete({
      where: { id },
    })

    this.logger.log(`Product with ID ${id} deleted`)
  }
}
```

### Serviço FastAPI Completo

```python
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import httpx
import asyncio

# Models
class ProductScrap(BaseModel):
    title: str
    code: str | None = None
    quantity: str | None = None
    unit: str | None = None
    unit_price: str | None = None
    total_price: str | None = None

class MatchRequest(BaseModel):
    user_id: str
    products_scrap: List[ProductScrap]

class ProductMatch(BaseModel):
    scrap_title: str
    product_id: str
    confidence: float

class MatchResponse(BaseModel):
    match: List[ProductMatch]
    unmatch: List[ProductScrap]
    llm_info: Dict[str, Any] | None = None

# Router
router = APIRouter(prefix="/match", tags=["match"])

# Dependencies
def verify_internal_token(token: str = Header(alias="X-Service-Token")):
    """Verify internal service token."""
    if token != settings.internal_token:
        raise HTTPException(status_code=401, detail="Token inválido")
    return token

# Services
async def fetch_user_products(user_id: str) -> List[Dict[str, Any]]:
    """Fetch user products from backend service."""
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                f"{settings.backend_base_url}/products/internal/{user_id}",
                headers={"X-Service-Token": settings.internal_token}
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(404, "User not found")
        elif e.response.status_code == 403:
            raise HTTPException(403, "Access denied")
        else:
            raise HTTPException(500, "Backend service error")
    except httpx.RequestError as e:
        raise HTTPException(500, f"Network error: {str(e)}")

async def call_openai_api(prompt: str) -> Dict[str, Any]:
    """Call OpenAI API for product matching."""
    try:
        response = await openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            response_format={"type": "json_object"}
        )

        return {
            "response": response.choices[0].message.content,
            "usage": response.usage.dict(),
            "model": "gpt-4o-mini"
        }
    except Exception as e:
        raise HTTPException(500, f"OpenAI API error: {str(e)}")

# Endpoints
@router.post("", response_model=MatchResponse)
async def match_products(
    payload: MatchRequest,
    token: str = Depends(verify_internal_token)
):
    """
    Match scraped products with user's existing products using AI.

    Args:
        payload: Match request containing user ID and scraped products
        token: Internal service token for authentication

    Returns:
        MatchResponse containing matched and unmatched products
    """
    try:
        # Fetch user products
        user_products = await fetch_user_products(payload.user_id)

        # Build prompt
        prompt = build_matching_prompt(payload.products_scrap, user_products)

        # Call OpenAI API
        openai_result = await call_openai_api(prompt)

        # Parse response
        result = json.loads(openai_result["response"])

        return MatchResponse(
            match=result.get("match", []),
            unmatch=result.get("unmatch", []),
            llm_info={
                "provider": "openai",
                "model": openai_result["model"],
                "prompt": prompt,
                "response": openai_result["response"],
                "usage": openai_result["usage"]
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Internal server error: {str(e)}")
```

## Ferramentas de Desenvolvimento

### VS Code Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-python.python",
    "ms-python.black-formatter",
    "ms-python.isort",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### VS Code Settings

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "python.formatting.provider": "black",
  "python.sortImports.args": ["--profile", "black"],
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

## Checklist de Código

### Antes de Fazer Commit

- [ ] Código segue as convenções de nomenclatura
- [ ] Imports estão organizados corretamente
- [ ] Funções têm type hints/documentação adequada
- [ ] Tratamento de erros está implementado
- [ ] Testes passam localmente
- [ ] Linting não apresenta erros
- [ ] Formatação está consistente
- [ ] Comentários explicam lógica complexa
- [ ] Performance foi considerada
- [ ] Acessibilidade foi verificada (frontend)

### Antes de Abrir PR

- [ ] Código foi revisado pelo próprio autor
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Breaking changes foram documentados
- [ ] Performance foi testada
- [ ] Compatibilidade foi verificada
- [ ] Segurança foi considerada

---

**Lembre-se**: O estilo de código é uma ferramenta para melhorar a legibilidade e manutenibilidade. O objetivo é facilitar a colaboração e reduzir bugs através de padrões consistentes.
