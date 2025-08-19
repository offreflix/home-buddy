# Exemplos Práticos do Sistema de Tracking

## Cenários de Uso

### 1. Monitorar Custos da LLM

```typescript
// Buscar custos dos últimos 7 dias
const stats = await trackingService.getOperationStats(userId, 7);
console.log(`Custo total LLM: $${stats.llmCosts.totalCost}`);
console.log(`Total de tokens: ${stats.llmCosts.totalTokens}`);
console.log(`Número de requests: ${stats.llmCosts.totalRequests}`);
```

### 2. Investigar Operação Específica

```typescript
// Buscar operação por Job ID
const operation = await trackingService.getOperationLogByJobId('12345');

console.log('=== OPERAÇÃO ===');
console.log(`Status: ${operation.status}`);
console.log(`Duração: ${operation.duration}ms`);
console.log(`Tipo: ${operation.operationType}`);

if (operation.scrapingLog) {
  console.log('\n=== SCRAPING ===');
  console.log(`URL: ${operation.scrapingLog.url}`);
  console.log(`Tempo: ${operation.scrapingLog.responseTime}ms`);
  console.log(
    `Produtos extraídos: ${operation.scrapingLog.outputData.productsCount}`,
  );
}

if (operation.matchingLog) {
  console.log('\n=== MATCHING ===');
  console.log(`Matches: ${operation.matchingLog.matchCount}`);
  console.log(`Unmatches: ${operation.matchingLog.unmatchCount}`);
  console.log(`Tempo: ${operation.matchingLog.responseTime}ms`);
}

if (operation.llmLogs?.length > 0) {
  console.log('\n=== LLM ===');
  const llm = operation.llmLogs[0];
  console.log(`Model: ${llm.model}`);
  console.log(`Tokens: ${llm.totalTokens}`);
  console.log(`Custo: $${llm.cost}`);
  console.log(`Tempo: ${llm.responseTime}ms`);
}
```

### 3. Identificar Operações Problemáticas

```typescript
// Buscar operações que falharam nas últimas 24h
const failedOps = await trackingService.getOperationLogs({
  status: OperationStatus.FAILED,
  startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  limit: 20,
});

console.log('=== OPERAÇÕES FALHADAS (24h) ===');
failedOps.forEach((op) => {
  console.log(`Job ${op.jobId}: ${op.errorMessage}`);
  console.log(`URL: ${op.metadata?.url}`);
  console.log(`Duração: ${op.duration}ms\n`);
});
```

### 4. Análise de Performance

```typescript
// Operações mais lentas dos últimos 30 dias
const slowOps = await trackingService.getOperationLogs({
  status: OperationStatus.COMPLETED,
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  limit: 50,
});

const sorted = slowOps
  .filter((op) => op.duration)
  .sort((a, b) => b.duration - a.duration)
  .slice(0, 10);

console.log('=== TOP 10 OPERAÇÕES MAIS LENTAS ===');
sorted.forEach((op, i) => {
  console.log(`${i + 1}. Job ${op.jobId}: ${op.duration}ms`);
  console.log(`   URL: ${op.metadata?.url}`);
  console.log(`   Tipo: ${op.operationType}\n`);
});
```

### 5. Relatório de Custos por Usuário

```typescript
// Função para gerar relatório de custos
async function generateCostReport(days = 30) {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true },
  });

  const report = [];

  for (const user of users) {
    const stats = await trackingService.getOperationStats(user.id, days);

    if (stats.llmCosts.totalCost > 0) {
      report.push({
        user: user.username,
        email: user.email,
        totalCost: stats.llmCosts.totalCost,
        totalTokens: stats.llmCosts.totalTokens,
        totalRequests: stats.llmCosts.totalRequests,
        avgCostPerRequest:
          stats.llmCosts.totalCost / stats.llmCosts.totalRequests,
      });
    }
  }

  // Ordenar por custo total
  report.sort((a, b) => b.totalCost - a.totalCost);

  console.log('=== RELATÓRIO DE CUSTOS LLM ===');
  console.log(`Período: ${days} dias\n`);

  let totalCost = 0;
  report.forEach((item, i) => {
    console.log(`${i + 1}. ${item.user} (${item.email})`);
    console.log(`   Custo Total: $${item.totalCost.toFixed(4)}`);
    console.log(`   Requests: ${item.totalRequests}`);
    console.log(`   Tokens: ${item.totalTokens}`);
    console.log(`   Custo/Request: $${item.avgCostPerRequest.toFixed(6)}\n`);

    totalCost += item.totalCost;
  });

  console.log(`CUSTO TOTAL GERAL: $${totalCost.toFixed(4)}`);

  return report;
}
```

### 6. Monitoramento em Tempo Real

```typescript
// Função para monitorar operações em execução
async function monitorRunningOperations() {
  const running = await trackingService.getOperationLogs({
    status: OperationStatus.RUNNING,
    limit: 100,
  });

  console.log(`=== ${running.length} OPERAÇÕES EM EXECUÇÃO ===`);

  running.forEach((op) => {
    const elapsed = Date.now() - op.startTime.getTime();
    console.log(`Job ${op.jobId}:`);
    console.log(`  Usuário: ${op.user?.username || 'Sistema'}`);
    console.log(`  Tipo: ${op.operationType}`);
    console.log(`  URL: ${op.metadata?.url}`);
    console.log(`  Tempo decorrido: ${Math.round(elapsed / 1000)}s\n`);
  });

  // Identificar operações "travadas" (mais de 5 minutos)
  const stuck = running.filter((op) => {
    const elapsed = Date.now() - op.startTime.getTime();
    return elapsed > 5 * 60 * 1000; // 5 minutos
  });

  if (stuck.length > 0) {
    console.log(`⚠️  ${stuck.length} OPERAÇÕES POSSIVELMENTE TRAVADAS:`);
    stuck.forEach((op) => {
      const elapsed = Math.round((Date.now() - op.startTime.getTime()) / 1000);
      console.log(`- Job ${op.jobId}: ${elapsed}s`);
    });
  }
}
```

### 7. Dashboard de Métricas

```typescript
// Função para gerar dashboard completo
async function generateDashboard(userId?: number, days = 7) {
  const stats = await trackingService.getOperationStats(userId, days);
  const operations = await trackingService.getOperationLogs({
    userId,
    startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
    limit: 1000,
  });

  // Agrupar por status
  const byStatus = operations.reduce((acc, op) => {
    acc[op.status] = (acc[op.status] || 0) + 1;
    return acc;
  }, {});

  // Agrupar por tipo
  const byType = operations.reduce((acc, op) => {
    acc[op.operationType] = (acc[op.operationType] || 0) + 1;
    return acc;
  }, {});

  // Calcular tempo médio
  const completed = operations.filter(
    (op) => op.status === 'COMPLETED' && op.duration,
  );
  const avgDuration =
    completed.length > 0
      ? completed.reduce((sum, op) => sum + op.duration, 0) / completed.length
      : 0;

  console.log('=== DASHBOARD DE OPERAÇÕES ===');
  console.log(`Período: ${days} dias`);
  console.log(`Usuário: ${userId ? 'Específico' : 'Todos'}\n`);

  console.log('📊 STATUS:');
  Object.entries(byStatus).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });

  console.log('\n📋 TIPOS:');
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });

  console.log('\n⏱️  PERFORMANCE:');
  console.log(`  Tempo médio: ${Math.round(avgDuration)}ms`);
  console.log(
    `  Taxa de sucesso: ${(((byStatus.COMPLETED || 0) / operations.length) * 100).toFixed(1)}%`,
  );

  console.log('\n💰 CUSTOS LLM:');
  console.log(`  Total: $${stats.llmCosts.totalCost.toFixed(4)}`);
  console.log(`  Requests: ${stats.llmCosts.totalRequests}`);
  console.log(`  Tokens: ${stats.llmCosts.totalTokens}`);
  console.log(
    `  Custo/Token: $${(stats.llmCosts.totalCost / stats.llmCosts.totalTokens).toFixed(8)}`,
  );
}
```

## Uso via API REST

### Buscar operações com curl

```bash
# Operações dos últimos 7 dias
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/tracking/operations?startDate=2024-01-01&limit=20"

# Estatísticas
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/tracking/stats?days=30"

# Operação específica
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/tracking/operations/12345"
```

### Integração com Frontend

```typescript
// Hook para buscar estatísticas
function useTrackingStats(days = 30) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tracking/stats?days=${days}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, [days]);

  return { stats, loading };
}
```

Estes exemplos mostram como aproveitar ao máximo o sistema de tracking para monitoramento, debugging e otimização do sistema.
