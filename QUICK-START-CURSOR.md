# ⚡ Quick Start - Cursor + Home Buddy MCP

## 🚀 Configuração Rápida (5 minutos)

### 1. Preparar o Servidor MCP

```bash
cd apps/mcp-server
yarn install
yarn build
```

### 2. Configurar Cursor Automaticamente

```bash
# Configuração automática
yarn setup-cursor

# Ou ver configuração manual
yarn setup-cursor-manual
```

### 3. Reiniciar Cursor

1. **Fechar** completamente o Cursor
2. **Reabrir** o Cursor
3. **Verificar** em `Settings` > `MCP` se aparece indicador verde

### 4. Testar

Abra o Composer (`Cmd/Ctrl + I`) e teste:

```
@home-buddy listar ferramentas disponíveis
```

## 🎯 Comandos Úteis

### Buscar Produtos

```
@home-buddy search_products query="arroz" userId=123
```

### Análise de Estoque

```
@home-buddy Analise meu estoque e me dê sugestões de compras
```

### Scraping de Nota Fiscal

```
@home-buddy scrape_receipt url="https://exemplo.com/nota" userId=123
```

### Matching Inteligente

```
@home-buddy match_products userId=123 scrapedProducts=[{"title":"Arroz Branco","quantity":1,"unit":"kg"}]
```

## 🔧 Solução Rápida de Problemas

### Servidor não conecta

```bash
# Verificar se está rodando
cd apps/mcp-server
yarn start
```

### Erro de token

```bash
# Verificar variáveis de ambiente
echo $INTERNAL_TOKEN
```

### Build não encontrado

```bash
cd apps/mcp-server
yarn build
```

## 📊 Ferramentas Disponíveis

- `search_products` - Busca produtos
- `get_product_details` - Detalhes de produto
- `update_stock` - Atualizar estoque
- `scrape_receipt` - Scraping de nota fiscal
- `match_products` - Matching com IA
- `get_categories` - Listar categorias
- `get_tracking_stats` - Estatísticas

## 🎨 Exemplos Práticos

### Análise Completa

```
@home-buddy Analise meu catálogo de produtos e me dê insights sobre:
- Produtos com estoque baixo
- Categorias mais utilizadas
- Oportunidades de economia
- Sugestões de organização
```

### Sugestões de Compras

```
@home-buddy Baseado no meu estoque atual, quais produtos devo comprar esta semana?
Considere um orçamento de R$ 200.
```

---

**🎉 Pronto! Agora você pode usar o Cursor com todas as funcionalidades do Home Buddy!**
