# Exemplos de Uso com Claude

## 🎯 Cenários Comuns

### 1. Análise de Produtos

```
Claude, analise meu catálogo de produtos e me dê sugestões de melhorias.
```

### 2. Sugestões de Compras

```
Baseado no meu estoque atual, quais produtos devo comprar esta semana?
```

### 3. Análise de Nota Fiscal

```
Analise esta nota fiscal e me ajude a organizar os produtos no meu sistema.
```

### 4. Otimização de Estoque

```
Como posso otimizar meu controle de estoque para reduzir desperdícios?
```

## 🔧 Comandos Úteis

### Buscar Produtos

```
Busque produtos de "limpeza" no meu catálogo
```

### Atualizar Estoque

```
Atualize o estoque do produto "Arroz Branco" para 5kg
```

### Iniciar Scraping

```
Faça scraping desta nota fiscal: https://exemplo.com/nota
```

### Ver Estatísticas

```
Mostre minhas estatísticas de tracking da última semana
```

## 📊 Recursos Disponíveis

### Acesso a Dados

- `homebuddy://products` - Catálogo completo
- `homebuddy://categories` - Categorias
- `homebuddy://stock` - Controle de estoque
- `homebuddy://tracking` - Logs e métricas

### Ferramentas Disponíveis

- `search_products` - Busca inteligente
- `get_product_details` - Detalhes de produtos
- `update_stock` - Controle de estoque
- `scrape_receipt` - Scraping de notas
- `match_products` - Matching com IA
- `get_tracking_stats` - Estatísticas

## 🎨 Prompts Contextuais

### Análise de Produtos

```
Prompt: product_analysis
Args: { userId: 123, focus: "estoque" }
```

### Sugestões de Compras

```
Prompt: shopping_suggestions
Args: { userId: 123, budget: 500 }
```

### Análise de Nota Fiscal

```
Prompt: receipt_analysis
Args: { receiptData: {...}, userId: 123 }
```

### Otimização de Estoque

```
Prompt: inventory_optimization
Args: { userId: 123, timeframe: "mês" }
```

## 🚀 Fluxo Típico

1. **Claude** recebe comando do usuário
2. **MCP Server** processa a requisição
3. **Backend/Matcher** executa operação
4. **Dados** são retornados formatados
5. **Claude** apresenta resultado ao usuário

## 💡 Dicas de Uso

- Seja específico com IDs de usuário
- Use filtros para buscas mais eficientes
- Combine múltiplas ferramentas para análises complexas
- Aproveite os prompts contextuais para insights profundos
