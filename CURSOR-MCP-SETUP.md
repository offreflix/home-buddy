# 🎯 Configuração do Cursor com MCP Home Buddy

## 📋 Pré-requisitos

1. **Cursor IDE** instalado ([Download](https://cursor.sh/))
2. **Servidor MCP** do Home Buddy funcionando
3. **Serviços** do Home Buddy rodando (Backend, Matcher, etc.)

## 🚀 Passo a Passo

### 1. Preparar o Servidor MCP

Primeiro, certifique-se de que o servidor MCP está funcionando:

```bash
# Navegar para o diretório do MCP
cd apps/mcp-server

# Instalar dependências
yarn install

# Build do projeto
yarn build

# Testar se está funcionando
yarn start
```

### 2. Configurar no Cursor

#### Opção A: Via Interface Gráfica

1. **Abrir Cursor** e ir em `Settings` (ou `Cmd/Ctrl + ,`)
2. **Navegar** para `Cursor Settings` > `MCP`
3. **Clicar** em "Add new global MCP server"
4. **Adicionar** a configuração:

```json
{
  "mcpServers": {
    "home-buddy": {
      "command": "node",
      "args": [
        "/caminho/completo/para/home-buddy-monorepo/apps/mcp-server/dist/index.js"
      ],
      "env": {
        "BACKEND_URL": "http://localhost:3000",
        "MATCHER_URL": "http://localhost:8000",
        "INTERNAL_TOKEN": "seu-token-interno",
        "OPENAI_API_KEY": "sk-sua-chave-openai",
        "REDIS_URL": "redis://localhost:6379",
        "DATABASE_URL": "postgresql://postgres:postgres@localhost:5432/home_buddy"
      }
    }
  }
}
```

#### Opção B: Via Arquivo de Configuração

1. **Localizar** o arquivo de configuração do Cursor:
   - **Windows**: `%APPDATA%\Cursor\User\settings.json`
   - **macOS**: `~/Library/Application Support/Cursor/User/settings.json`
   - **Linux**: `~/.config/Cursor/User/settings.json`

2. **Adicionar** a configuração MCP:

```json
{
  "mcp.servers": {
    "home-buddy": {
      "command": "node",
      "args": [
        "/caminho/completo/para/home-buddy-monorepo/apps/mcp-server/dist/index.js"
      ],
      "env": {
        "BACKEND_URL": "http://localhost:3000",
        "MATCHER_URL": "http://localhost:8000",
        "INTERNAL_TOKEN": "seu-token-interno",
        "OPENAI_API_KEY": "sk-sua-chave-openai"
      }
    }
  }
}
```

### 3. Verificar Conexão

1. **Reiniciar** o Cursor
2. **Verificar** nas configurações MCP se aparece um indicador verde
3. **Testar** no Composer:

```
@home-buddy listar ferramentas disponíveis
```

## 🎨 Como Usar no Cursor

### 1. Via Composer (Recomendado)

Abra o Composer (`Cmd/Ctrl + I`) e use comandos como:

```
Busque produtos de "limpeza" no meu catálogo do Home Buddy
```

```
Analise meu estoque atual e me dê sugestões de compras
```

```
Faça scraping desta nota fiscal: https://exemplo.com/nota
```

### 2. Via Chat

No chat do Cursor, mencione o servidor:

```
@home-buddy get_categories userId=123
```

### 3. Comandos Específicos

#### Buscar Produtos

```
@home-buddy search_products query="arroz" userId=123 limit=5
```

#### Atualizar Estoque

```
@home-buddy update_stock productId=1 userId=123 quantity=5 operation="set"
```

#### Matching Inteligente

```
@home-buddy match_products userId=123 scrapedProducts=[{"title":"Arroz Branco","quantity":1,"unit":"kg"}]
```

#### Obter Estatísticas

```
@home-buddy get_tracking_stats userId=123 period="week"
```

## 🔧 Solução de Problemas

### Erro: "Servidor MCP não encontrado"

1. **Verificar** se o caminho está correto
2. **Testar** manualmente:
   ```bash
   node /caminho/para/apps/mcp-server/dist/index.js
   ```

### Erro: "Falha na conexão"

1. **Verificar** se os serviços estão rodando:

   ```bash
   # Backend
   curl http://localhost:3000/health

   # Matcher
   curl http://localhost:8000/docs
   ```

2. **Verificar** variáveis de ambiente no `.env`

### Erro: "Token inválido"

1. **Verificar** se `INTERNAL_TOKEN` está correto
2. **Verificar** se o token está configurado no backend

## 📊 Ferramentas Disponíveis

### Tools (Ferramentas)

- `search_products` - Busca produtos
- `get_product_details` - Detalhes de produto
- `update_stock` - Atualizar estoque
- `scrape_receipt` - Scraping de nota fiscal
- `match_products` - Matching com IA
- `get_categories` - Listar categorias
- `get_tracking_stats` - Estatísticas

### Resources (Recursos)

- `homebuddy://products` - Catálogo completo
- `homebuddy://categories` - Categorias
- `homebuddy://stock` - Controle de estoque
- `homebuddy://tracking` - Logs e métricas
- `homebuddy://scraping-jobs` - Jobs de scraping

### Prompts (Prompts Contextuais)

- `product_analysis` - Análise de produtos
- `shopping_suggestions` - Sugestões de compras
- `receipt_analysis` - Análise de notas fiscais
- `inventory_optimization` - Otimização de estoque

## 🎯 Exemplos Práticos

### Análise Completa de Produtos

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

### Scraping e Matching

```
@home-buddy Faça scraping desta nota fiscal e compare os produtos com meu catálogo:
https://exemplo.com/nota-fiscal
```

## 🔄 Atualizações

Para atualizar o servidor MCP:

1. **Parar** o servidor atual
2. **Fazer** build novamente:
   ```bash
   cd apps/mcp-server
   yarn build
   ```
3. **Reiniciar** o Cursor

## 📚 Recursos Adicionais

- [Documentação Cursor MCP](https://docs.cursor.sh/mcp)
- [Especificação MCP](https://modelcontextprotocol.info/)
- [Exemplos de Servidores MCP](https://github.com/modelcontextprotocol/servers)

---

**🎉 Configuração concluída!**

Agora você pode usar o Cursor com todas as funcionalidades do Home Buddy através do Model Context Protocol!
