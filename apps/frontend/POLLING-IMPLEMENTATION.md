# Implementação do Polling Inteligente

## 📋 Visão Geral

O sistema de polling foi implementado para acompanhar o progresso de jobs de scraping em tempo real, com atualizações adaptativas baseadas no estado do job.

## 🏗️ Arquitetura

### **Backend (NestJS)**

- **Processador**: Atualiza progresso durante execução
- **Serviço**: Fornece status detalhado com mensagens
- **Controller**: Endpoints para consulta de status

### **Frontend (React)**

- **Hook**: `useJobPolling` - Gerencia polling automático
- **Componente**: `JobProgress` - Exibe progresso visual
- **Formulário**: `ScrapingForm` - Exemplo de uso completo

## 🔧 Implementação

### **1. Backend - Progresso Detalhado**

#### **Processador (`scrapping-queue.processor.ts`)**

```typescript
@Process('scrape-nfc')
async handleScraping(job: Job<ScrapingJobData>): Promise<ScrapingJobResult> {
  // Fase 1: Iniciando (0-10%)
  await job.progress(0);

  // Fase 2: Processando (10-50%)
  await job.progress(10);

  const result = await this.scrappingService.scrapeNFC(job.data.url);

  // Fase 3: Concluído (50%)
  await job.progress(50);

  return { success: true, data: result };
}
```

#### **Serviço (`scrapping-queue.service.ts`)**

```typescript
async getJobStatus(jobId: string): Promise<any> {
  const job = await this.scrapingQueue.getJob(jobId);
  const state = await job.getState();
  const progress = await job.progress();

  // Determinar mensagem baseada no estado
  let message = '';
  if (state === 'waiting') message = 'Aguardando na fila...';
  else if (state === 'active') {
    if (progress < 10) message = 'Iniciando scraping...';
    else if (progress < 50) message = 'Extraindo dados...';
    else message = 'Dados extraídos!';
  }

  return { jobId, state, progress, message };
}
```

### **2. Frontend - Polling Inteligente**

#### **Hook (`use-job-polling.ts`)**

```typescript
export const useJobPolling = (jobId: string | null) => {
  const pollJobStatus = useCallback(async (id: string) => {
    const jobStatus = await fetchJobStatus(id)

    // Polling adaptativo
    if (jobStatus.state === 'active') {
      setTimeout(() => pollJobStatus(id), 2000) // 2s
    } else if (jobStatus.state === 'waiting') {
      setTimeout(() => pollJobStatus(id), 5000) // 5s
    } else if (jobStatus.state === 'completed' || 'failed') {
      // Parar polling
      return
    }
  }, [])

  return { status, isLoading, error, progress, message }
}
```

#### **Componente (`job-progress.tsx`)**

```typescript
export const JobProgress: React.FC<JobProgressProps> = ({
  status,
  progress,
  message,
  isCompleted,
  isFailed,
}) => {
  return (
    <Card>
      <CardContent>
        {/* Progress Bar */}
        <Progress value={progress} />
        <p>{message}</p>

        {/* Status Icons */}
        {isCompleted && <CheckCircle />}
        {isFailed && <AlertCircle />}
      </CardContent>
    </Card>
  );
};
```

## 🎯 Características do Polling

### **1. Adaptativo**

- **Processamento ativo**: 2 segundos
- **Na fila**: 5 segundos
- **Erro**: 10 segundos

### **2. Inteligente**

- Para automaticamente quando job finaliza
- Reconecta em caso de erro
- Cleanup automático no unmount

### **3. Detalhado**

- Progresso percentual
- Mensagens contextuais
- Estados visuais
- Timestamps

## 📊 Estados do Job

| Estado          | Progresso | Mensagem                     | Cor      |
| --------------- | --------- | ---------------------------- | -------- |
| `waiting`       | 0%        | "Aguardando na fila..."      | Amarelo  |
| `active` < 10%  | 0-10%     | "Iniciando scraping..."      | Azul     |
| `active` < 50%  | 10-50%    | "Extraindo dados..."         | Azul     |
| `active` >= 50% | 50%       | "Dados extraídos!"           | Azul     |
| `completed`     | 100%      | "Processamento concluído!"   | Verde    |
| `failed`        | 0%        | "Erro durante processamento" | Vermelho |

## 🚀 Como Usar

### **1. Hook Básico**

```typescript
const { status, progress, message, isCompleted } = useJobPolling(jobId)
```

### **2. Componente Completo**

```typescript
<JobProgress
  status={status}
  isLoading={isLoading}
  error={error}
  isCompleted={isCompleted}
  isFailed={isFailed}
  progress={progress}
  message={message}
/>
```

### **3. Formulário Completo**

```typescript
<ScrapingForm />
```

## 🔧 Configuração

### **Backend**

- Progresso atualizado durante processamento
- Mensagens contextuais baseadas no estado
- Timestamps para auditoria

### **Frontend**

- Polling automático com cleanup
- Estados visuais intuitivos
- Tratamento de erros robusto

## 📈 Benefícios

1. **Experiência do Usuário**
   - Feedback visual em tempo real
   - Progresso detalhado
   - Estados claros

2. **Performance**
   - Polling adaptativo
   - Cleanup automático
   - Reconexão inteligente

3. **Manutenibilidade**
   - Código reutilizável
   - Separação de responsabilidades
   - Fácil de testar

## 🐛 Troubleshooting

### **Job não atualiza**

- Verificar se Redis está rodando
- Verificar logs do backend
- Verificar se job existe

### **Polling para muito cedo**

- Verificar se job realmente finalizou
- Verificar estado no Bull-Board

### **Erro de conexão**

- Polling tenta novamente em 10s
- Verificar se API está acessível

## 🎯 Próximos Passos

1. **Notificações Push**
   - WebSocket para atualizações instantâneas
   - Notificações do navegador

2. **Métricas Avançadas**
   - Tempo médio de processamento
   - Taxa de sucesso
   - Histórico de jobs

3. **Otimizações**
   - Cache de status
   - Batch polling
   - Lazy loading
