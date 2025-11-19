# Refatoração Seguindo Padrão do Products

## 📋 Análise do Padrão

### **Estrutura do Products:**

```
apps/frontend/src/app/(private)/products/
├── page.tsx              # Página simples
├── products.view.tsx     # View principal
├── product.model.ts      # Model com hooks
├── products.type.ts      # Tipos TypeScript
├── product.schema.ts     # Schemas de validação
├── modal.store.ts        # Store para modais
└── ui/
    ├── product-main.tsx  # Componente principal
    ├── modal/            # Modais
    └── components/       # Componentes
```

## ✅ Refatoração Implementada

### **1. Estrutura Seguindo Padrão**

```
apps/frontend/src/app/(private)/scraping/
├── page.tsx              # ✅ Página simples
├── scraping.view.tsx     # ✅ View principal
├── scraping.model.ts     # ✅ Model com hooks
├── scraping.type.ts      # ✅ Tipos TypeScript
├── scraping.schema.ts    # ✅ Schemas de validação
├── modal.store.ts        # ✅ Store para modais
└── ui/
    └── scraping-main.tsx # ✅ Componente principal
```

### **2. Arquivos Criados**

#### **page.tsx** - Página Simples

```typescript
import { ScrapingView } from "./scraping.view";

export default function ScrapingPage() {
  return <ScrapingView />
}
```

#### **scraping.view.tsx** - View Principal

```typescript
'use client'

import { ScrapingMain } from './ui/scraping-main'
import { useScrapingModel } from './scraping.model'

export function ScrapingView() {
  const { ...methods } = useScrapingModel()

  return (
    <div className="p-8 flex flex-col gap-4">
      <ScrapingMain {...methods} />
    </div>
  )
}
```

#### **scraping.model.ts** - Model com Hooks

```typescript
export const useScrapingModel = () => {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(false)

  // Queries e Mutations
  const jobsQuery = useQuery({...})
  const jobStatusQuery = useQuery({...})
  const createJobMutation = useMutation({...})

  return {
    currentJobId,
    isPolling,
    jobsQuery,
    jobStatusQuery,
    createJobMutation,
    stopPolling,
    startNewJob,
  }
}
```

#### **scraping.type.ts** - Tipos TypeScript

```typescript
export type JobStatus = 'waiting' | 'active' | 'completed' | 'failed'
export type JobPhase = 'queued' | 'scraping' | 'completed' | 'failed'

export interface ScrapingJob {
  jobId: string
  state: JobStatus
  progress: number
  message: string
  phase: JobPhase
  result?: ScrapedData
  // ...
}
```

#### **scraping.schema.ts** - Schemas de Validação

```typescript
export const createScrapingJobSchema = z.object({
  url: z.string().url('URL inválida').nonempty('URL é obrigatória'),
  userId: z.string().optional(),
})
```

#### **modal.store.ts** - Store para Modais

```typescript
type ScrapingModalStore = {
  isJobDetailsModalOpen: boolean
  toggleJobDetailsModal: () => void
  selectedJob: ScrapingJob | null
  setSelectedJob: (job: ScrapingJob) => void
  // ...
}
```

#### **ui/scraping-main.tsx** - Componente Principal

```typescript
export function ScrapingMain(props: ScrapingMainProps) {
  const {
    currentJobId,
    isPolling,
    jobStatusQuery,
    createJobMutation,
    startNewJob
  } = props

  // Lógica do componente
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Formulário e Progresso */}
    </div>
  )
}
```

## 🎯 Benefícios da Refatoração

### **1. Consistência**

- ✅ Segue padrão estabelecido no projeto
- ✅ Estrutura familiar para desenvolvedores
- ✅ Fácil de manter e estender

### **2. Separação de Responsabilidades**

- ✅ **Model**: Lógica de negócio e hooks
- ✅ **View**: Orquestração de componentes
- ✅ **UI**: Componentes de interface
- ✅ **Types**: Definições de tipos
- ✅ **Schema**: Validação de dados

### **3. Reutilização**

- ✅ Model pode ser usado em outros componentes
- ✅ Tipos compartilhados
- ✅ Schemas reutilizáveis

### **4. Manutenibilidade**

- ✅ Código organizado e estruturado
- ✅ Fácil de testar
- ✅ Fácil de debugar

## 🔧 Diferenças do Padrão Original

### **Products (Original)**

- Usa React Table para dados tabulares
- Múltiplos modais (create, edit, delete, quantity)
- View modes (table/card)
- Filtros e paginação

### **Scraping (Adaptado)**

- Foco em jobs assíncronos
- Polling automático
- Progresso em tempo real
- Estados de job (waiting, active, completed, failed)

## 📊 Comparação de Arquitetura

| Aspecto    | Products              | Scraping                     |
| ---------- | --------------------- | ---------------------------- |
| **Model**  | `useProductModel`     | `useScrapingModel`           |
| **View**   | `ProductsView`        | `ScrapingView`               |
| **UI**     | `ProductMain`         | `ScrapingMain`               |
| **Store**  | `useModalStore`       | `useScrapingModalStore`      |
| **Types**  | `Product`, `Category` | `ScrapingJob`, `ScrapedData` |
| **Schema** | `createProductSchema` | `createScrapingJobSchema`    |

## 🚀 Próximos Passos

### **1. Modais (Futuro)**

- Job Details Modal
- Job History Modal
- Settings Modal

### **2. Componentes Adicionais**

- Job List Component
- Job History Component
- Settings Component

### **3. Funcionalidades Avançadas**

- Batch Processing
- Job Scheduling
- Notifications

## 🎯 Conclusão

A refatoração seguiu com sucesso o padrão estabelecido pelo `products`, mantendo:

1. **Consistência**: Estrutura familiar
2. **Escalabilidade**: Fácil de estender
3. **Manutenibilidade**: Código organizado
4. **Reutilização**: Componentes modulares

O código agora está alinhado com as melhores práticas do projeto e pronto para futuras expansões.
