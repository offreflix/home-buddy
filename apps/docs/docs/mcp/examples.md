---
id: examples
title: Exemplos Práticos do MCP Server
sidebar_position: 5
description: Casos de uso reais e exemplos práticos de como usar o MCP Server com Claude
keywords: [mcp, exemplos, casos de uso, prático, claude, home buddy]
---

# 🎯 Exemplos Práticos do MCP Server

Casos de uso reais e exemplos práticos de como usar o MCP Server do Home Buddy com Claude.

## 🛒 Gestão de Produtos

### Buscar Produtos por Categoria

```
Claude, busque todos os produtos da categoria "Limpeza" no meu catálogo
```

**Resposta esperada:**

```
Encontrei 15 produtos na categoria Limpeza:

1. Detergente Líquido - R$ 8,50 (Estoque: 15)
2. Sabão em Pó - R$ 12,00 (Estoque: 8)
3. Amaciante - R$ 18,00 (Estoque: 12)
4. Desinfetante - R$ 6,50 (Estoque: 20)
5. Limpador Multiuso - R$ 9,00 (Estoque: 5)

Produtos com estoque baixo: Limpador Multiuso (5 unidades)
```

### Analisar Produto Específico

```
Claude, me mostre os detalhes completos do produto "Detergente Líquido"
```

**Resposta esperada:**

```
Detalhes do produto: Detergente Líquido

📦 Informações Básicas:
- ID: 123
- Categoria: Limpeza
- Preço: R$ 8,50
- Estoque atual: 15 unidades

📊 Estatísticas:
- Última compra: 15/01/2024
- Consumo médio: 2 unidades/semana
- Próxima reposição: 22/01/2024

💡 Sugestões:
- Estoque adequado para 7 semanas
- Preço competitivo no mercado
- Produto com boa rotatividade
```

### Atualizar Estoque

```
Claude, adicione 10 unidades ao estoque do produto "Detergente Líquido"
```

**Resposta esperada:**

```
✅ Estoque atualizado com sucesso!

Produto: Detergente Líquido
Estoque anterior: 15 unidades
Quantidade adicionada: 10 unidades
Estoque atual: 25 unidades

📊 Impacto:
- Estoque suficiente para 12 semanas
- Status: Adequado
- Próxima reposição: 05/02/2024
```

## 📊 Análise de Dados

### Estatísticas de Consumo

```
Claude, me mostre as estatísticas de consumo dos meus produtos no último mês
```

**Resposta esperada:**

```
📈 Estatísticas de Consumo - Último Mês

🏆 Top 5 Produtos Mais Consumidos:
1. Detergente Líquido - 8 unidades
2. Papel Higiênico - 6 rolos
3. Sabão em Pó - 4 unidades
4. Amaciante - 3 unidades
5. Desinfetante - 3 unidades

💰 Gastos por Categoria:
- Limpeza: R$ 85,50 (45%)
- Higiene: R$ 65,00 (35%)
- Alimentação: R$ 40,00 (20%)

📊 Insights:
- Consumo 15% maior que o mês anterior
- Categoria Limpeza representa quase metade dos gastos
- Produtos de higiene com consumo estável
```

### Análise de Custos com IA

```
Claude, me mostre os custos com IA do último mês
```

**Resposta esperada:**

```
🤖 Custos com IA - Último Mês

💰 Resumo Financeiro:
- Custo total: R$ 2,50
- Operações realizadas: 45
- Custo médio por operação: R$ 0,056

📊 Breakdown por Ferramenta:
- match_products: R$ 1,80 (72%)
- scrape_receipt: R$ 0,50 (20%)
- product_analysis: R$ 0,20 (8%)

📈 Tendências:
- Custo 20% menor que o mês anterior
- Eficiência melhorou com otimizações
- ROI positivo: economia de R$ 15,00 em tempo
```

## 🔄 Automação

### Scraping de Nota Fiscal

```
Claude, faça scraping desta nota fiscal: https://exemplo.com/nota-fiscal-123
```

**Resposta esperada:**

```
🔄 Scraping iniciado com sucesso!

📋 Detalhes do Job:
- URL: https://exemplo.com/nota-fiscal-123
- Job ID: 456
- Status: PROCESSING
- Produtos encontrados: 8

⏱️ Tempo estimado: 2-3 minutos

📦 Produtos detectados:
1. Detergente Líquido 500ml
2. Sabão em Pó 1kg
3. Amaciante 2L
4. Papel Higiênico 4 rolos
5. Desinfetante 1L
6. Limpador Multiuso 500ml
7. Esponja de Aço
8. Rodo com Pano

💡 Próximos passos:
- Aguarde conclusão do scraping
- Execute matching inteligente
- Revise e adicione ao catálogo
```

### Matching Inteligente

```
Claude, execute matching inteligente para os produtos extraídos da nota fiscal
```

**Resposta esperada:**

```
🤖 Matching Inteligente Concluído!

📊 Resultados:
- Produtos processados: 8
- Matches encontrados: 7
- Confiança média: 92%
- Custo IA: R$ 0,15

✅ Matches com Alta Confiança (95%+):
1. Detergente Líquido → Detergente Líquido (98%)
2. Sabão em Pó → Sabão em Pó (96%)
3. Amaciante → Amaciante (95%)

⚠️ Matches com Confiança Média (80-94%):
4. Papel Higiênico → Papel Higiênico (89%)
5. Desinfetante → Desinfetante (87%)
6. Limpador Multiuso → Limpador Multiuso (85%)

❌ Sem Match:
7. Esponja de Aço (produto novo)
8. Rodo com Pano (produto novo)

💡 Sugestões:
- Adicionar produtos com alta confiança automaticamente
- Revisar produtos com confiança média
- Cadastrar produtos novos manualmente
```

## 🛍️ Sugestões de Compras

### Análise de Estoque

```
Claude, analise meu estoque e me dê sugestões de compras para esta semana
```

**Resposta esperada:**

```
🛒 Sugestões de Compras - Esta Semana

🚨 Produtos com Estoque Crítico:
1. Limpador Multiuso - 2 unidades (comprar 3)
2. Papel Higiênico - 1 rolo (comprar 4)
3. Sabão em Pó - 3 unidades (comprar 2)

⚠️ Produtos com Estoque Baixo:
4. Detergente Líquido - 8 unidades (comprar 2)
5. Amaciante - 6 unidades (comprar 1)

💰 Orçamento Estimado:
- Críticos: R$ 45,00
- Baixos: R$ 25,00
- Total: R$ 70,00

📊 Análise por Categoria:
- Limpeza: R$ 35,00 (50%)
- Higiene: R$ 20,00 (29%)
- Utilidades: R$ 15,00 (21%)

💡 Dicas:
- Compre produtos críticos imediatamente
- Produtos baixos podem aguardar até quinta-feira
- Considere comprar em maior quantidade para economizar
```

### Otimização de Compras

```
Claude, otimize minhas compras considerando padrões de consumo e sazonalidade
```

**Resposta esperada:**

```
🎯 Otimização de Compras Inteligente

📊 Análise de Padrões:
- Consumo médio semanal: R$ 45,00
- Pico de consumo: Segundas-feiras
- Sazonalidade: +20% em dezembro

🛒 Plano de Compras Otimizado:

📅 Esta Semana (Crítica):
- Limpador Multiuso: 3 unidades
- Papel Higiênico: 4 rolos
- Total: R$ 35,00

📅 Próxima Semana (Preventiva):
- Detergente Líquido: 2 unidades
- Amaciante: 1 unidade
- Sabão em Pó: 2 unidades
- Total: R$ 30,00

📅 Semana 3 (Manutenção):
- Desinfetante: 1 unidade
- Produtos de higiene: R$ 20,00
- Total: R$ 25,00

💰 Economia Projetada:
- Compras planejadas: R$ 90,00
- Compras reativas: R$ 120,00
- Economia: R$ 30,00 (25%)

🎯 Benefícios:
- Redução de 40% em compras de emergência
- Melhor controle de orçamento
- Estoque sempre adequado
```

## 📈 Relatórios e Insights

### Relatório Mensal

```
Claude, gere um relatório mensal completo dos meus produtos e gastos
```

**Resposta esperada:**

```
📊 Relatório Mensal - Janeiro 2024

💰 Resumo Financeiro:
- Gastos totais: R$ 450,00
- Produtos adquiridos: 85 unidades
- Custo médio por produto: R$ 5,29

📦 Estatísticas de Produtos:
- Total de produtos: 60
- Novos produtos: 8
- Produtos descontinuados: 2
- Categorias ativas: 4

🏆 Top 10 Produtos Mais Consumidos:
1. Detergente Líquido - 12 unidades
2. Papel Higiênico - 8 rolos
3. Sabão em Pó - 6 unidades
4. Amaciante - 5 unidades
5. Desinfetante - 4 unidades
6. Limpador Multiuso - 4 unidades
7. Shampoo - 3 unidades
8. Condicionador - 3 unidades
9. Sabonete - 3 unidades
10. Creme Dental - 2 unidades

📈 Tendências:
- Consumo 15% maior que dezembro
- Categoria Limpeza lidera (45%)
- Produtos de higiene estáveis (35%)
- Alimentação em crescimento (20%)

🤖 Custos com IA:
- Total: R$ 2,50
- Operações: 45
- Economia gerada: R$ 25,00
- ROI: 1000%

💡 Insights e Recomendações:
1. Aumentar estoque de produtos de limpeza
2. Considerar compras em maior quantidade
3. Implementar alertas de estoque baixo
4. Otimizar frequência de compras
```

### Análise de Sazonalidade

```
Claude, analise os padrões sazonais dos meus produtos
```

**Resposta esperada:**

```
📅 Análise de Sazonalidade

🌡️ Padrões Identificados:

❄️ Inverno (Jun-Ago):
- Consumo +25% em produtos de limpeza
- Amaciante com pico de uso
- Produtos de higiene estáveis

🌸 Primavera (Set-Nov):
- Limpeza geral +30%
- Produtos de organização em alta
- Higiene pessoal estável

☀️ Verão (Dez-Fev):
- Consumo geral +20%
- Produtos de limpeza pesada
- Higiene com aumento moderado

🍂 Outono (Mar-Mai):
- Consumo normal
- Preparação para inverno
- Estoque de segurança

📊 Recomendações Sazonais:

❄️ Preparação para Inverno:
- Estoque 20% extra de produtos de limpeza
- Compre amaciante em maior quantidade
- Prepare produtos para limpeza pesada

🌸 Preparação para Primavera:
- Foque em produtos de organização
- Limpeza geral e desinfecção
- Renovação de estoque

☀️ Preparação para Verão:
- Aumente estoque geral em 15%
- Produtos de limpeza pesada
- Higiene pessoal adequada

🍂 Preparação para Outono:
- Manutenção de estoque
- Preparação para inverno
- Otimização de compras
```

## 🔧 Troubleshooting

### Problemas Comuns

#### Erro de Conexão

```
Claude, não consigo acessar meus produtos
```

**Diagnóstico:**

```
🔍 Diagnóstico de Conectividade

❌ Problemas Identificados:
- Backend não está respondendo na porta 3000
- Token de autenticação pode estar inválido
- MCP Server pode estar offline

✅ Soluções:
1. Verifique se o backend está rodando
2. Confirme o token interno nas configurações
3. Reinicie o MCP Server
4. Teste a conectividade manualmente

🔧 Comandos de Verificação:
- Backend: curl http://localhost:3000/health
- MCP Server: curl http://localhost:3001/health
- Token: Verifique arquivo .env
```

#### Produto Não Encontrado

```
Claude, não encontro o produto "X" no meu catálogo
```

**Diagnóstico:**

```
🔍 Busca de Produto

❌ Produto "X" não encontrado

✅ Alternativas:
1. Verifique a grafia do nome
2. Tente termos similares
3. Busque por categoria
4. Liste todos os produtos

🔧 Comandos Úteis:
- "Liste todos os produtos"
- "Busque produtos de [categoria]"
- "Mostre produtos com estoque baixo"
```

---

**🎉 Exemplos práticos completos!**

Agora você tem uma visão completa de como usar o MCP Server do Home Buddy com Claude para gerenciar seus produtos de forma inteligente e eficiente!
