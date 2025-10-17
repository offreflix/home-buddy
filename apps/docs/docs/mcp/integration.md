---
id: integration
title: Integração com Claude Desktop
sidebar_position: 3
description: Guia completo para integrar o MCP Server com Claude Desktop
keywords: [mcp, claude desktop, integração, configuração, anthropic]
---

# 🔌 Integração com Claude Desktop

Guia completo para integrar o MCP Server do Home Buddy com Claude Desktop.

## 🎯 O que é Claude Desktop?

Claude Desktop é a aplicação oficial da Anthropic que permite usar Claude localmente com acesso a ferramentas e recursos externos através do Model Context Protocol (MCP).

## 📋 Pré-requisitos

- **Claude Desktop** instalado
- **MCP Server** do Home Buddy configurado e rodando
- **Backend** e **Matcher** do Home Buddy funcionando

## 🚀 Instalação do Claude Desktop

### Windows

1. Baixe o instalador em: https://claude.ai/download
2. Execute o instalador
3. Siga as instruções de instalação

### macOS

```bash
# Via Homebrew
brew install --cask claude

# Ou baixe diretamente do site
```

### Linux

```bash
# Download direto
wget https://claude.ai/download/claude-desktop-linux.AppImage
chmod +x claude-desktop-linux.AppImage
./claude-desktop-linux.AppImage
```

## ⚙️ Configuração do Claude Desktop

### 1. Localizar Arquivo de Configuração

#### Windows

```
%APPDATA%\Claude\claude_desktop_config.json
```

#### macOS

```
~/Library/Application Support/Claude/claude_desktop_config.json
```

#### Linux

```
~/.config/claude/claude_desktop_config.json
```

### 2. Configurar MCP Server

Crie ou edite o arquivo de configuração:

```json
{
  "mcpServers": {
    "home-buddy": {
      "command": "node",
      "args": [
        "C:\\dev\\home-buddy-monorepo\\apps\\mcp-server\\dist\\index.js"
      ],
      "env": {
        "BACKEND_URL": "http://localhost:3000",
        "MATCHER_URL": "http://localhost:8000",
        "INTERNAL_TOKEN": "homebuddy-mcp-secure-token-2024",
        "OPENAI_API_KEY": "sk-your-openai-key"
      }
    }
  }
}
```

### 3. Configuração Detalhada

#### Caminho Absoluto

```json
{
  "mcpServers": {
    "home-buddy": {
      "command": "node",
      "args": [
        "/caminho/absoluto/para/home-buddy-monorepo/apps/mcp-server/dist/index.js"
      ],
      "env": {
        "BACKEND_URL": "http://localhost:3000",
        "MATCHER_URL": "http://localhost:8000",
        "INTERNAL_TOKEN": "seu-token-interno",
        "OPENAI_API_KEY": "sua-chave-openai"
      }
    }
  }
}
```

#### Múltiplos Servidores

```json
{
  "mcpServers": {
    "home-buddy": {
      "command": "node",
      "args": ["/path/to/home-buddy-mcp-server/dist/index.js"],
      "env": {
        "BACKEND_URL": "http://localhost:3000",
        "MATCHER_URL": "http://localhost:8000",
        "INTERNAL_TOKEN": "token-1"
      }
    },
    "other-mcp-server": {
      "command": "python",
      "args": ["/path/to/other-server.py"],
      "env": {
        "API_KEY": "other-key"
      }
    }
  }
}
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente

#### Desenvolvimento

```json
{
  "mcpServers": {
    "home-buddy": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "NODE_ENV": "development",
        "BACKEND_URL": "http://localhost:3000",
        "MATCHER_URL": "http://localhost:8000",
        "INTERNAL_TOKEN": "dev-token",
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

#### Produção

```json
{
  "mcpServers": {
    "home-buddy": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "NODE_ENV": "production",
        "BACKEND_URL": "https://api.homebuddy.com",
        "MATCHER_URL": "https://matcher.homebuddy.com",
        "INTERNAL_TOKEN": "prod-token",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### Configuração com Docker

Se o MCP Server estiver rodando em Docker:

```json
{
  "mcpServers": {
    "home-buddy": {
      "command": "docker",
      "args": [
        "exec",
        "-i",
        "home-buddy-mcp-server",
        "node",
        "/app/dist/index.js"
      ],
      "env": {
        "BACKEND_URL": "http://backend:3000",
        "MATCHER_URL": "http://matcher:8000",
        "INTERNAL_TOKEN": "docker-token"
      }
    }
  }
}
```

## 🧪 Testando a Integração

### 1. Reiniciar Claude Desktop

Após configurar, reinicie o Claude Desktop para carregar as novas configurações.

### 2. Verificar Conexão

No Claude Desktop, você deve ver uma indicação de que o MCP Server está conectado.

### 3. Testar Ferramentas

#### Teste Básico

```
Claude, liste as ferramentas disponíveis do Home Buddy
```

#### Teste de Produtos

```
Claude, busque produtos de "limpeza" no meu catálogo
```

#### Teste de Categorias

```
Claude, me mostre todas as categorias de produtos
```

## 🎯 Exemplos de Uso

### 🛒 Gestão de Produtos

```
Claude, analise meu estoque e me dê sugestões de compras para esta semana

Claude, busque produtos de "limpeza" que estão com estoque baixo

Claude, me mostre os detalhes do produto com ID 123
```

### 📊 Análise de Dados

```
Claude, me mostre estatísticas dos meus produtos mais consumidos

Claude, analise os custos de IA do último mês

Claude, identifique padrões nas minhas compras
```

### 🔄 Automação

```
Claude, atualize o estoque de todos os produtos da categoria "limpeza"

Claude, execute matching inteligente para estes produtos extraídos

Claude, gere um relatório de otimização de estoque
```

### 🧾 Scraping de Notas Fiscais

```
Claude, faça scraping desta nota fiscal: https://exemplo.com/nota

Claude, analise os produtos extraídos e sugira onde adicionar no meu catálogo

Claude, execute matching automático para os produtos da nota fiscal
```

## 🚨 Solução de Problemas

### Problemas Comuns

#### 1. MCP Server Não Conecta

**Sintomas**: Claude não reconhece as ferramentas do Home Buddy

**Soluções**:

- Verifique se o caminho do arquivo está correto
- Confirme se o MCP Server está rodando
- Verifique as variáveis de ambiente
- Reinicie o Claude Desktop

#### 2. Erro de Permissão

**Sintomas**: Erro ao executar o arquivo JavaScript

**Soluções**:

```bash
# Dar permissão de execução
chmod +x /path/to/mcp-server/dist/index.js

# Verificar se o Node.js está no PATH
which node
```

#### 3. Token Inválido

**Sintomas**: Erro de autenticação nas ferramentas

**Soluções**:

- Verifique se o `INTERNAL_TOKEN` está correto
- Confirme se o token está configurado no backend
- Teste a conectividade diretamente

#### 4. Timeout de Conexão

**Sintomas**: Ferramentas demoram muito para responder

**Soluções**:

- Verifique se o backend está rodando
- Aumente o timeout nas configurações
- Verifique a conectividade de rede

### Debug Avançado

#### Logs do Claude Desktop

```bash
# Windows
%APPDATA%\Claude\logs\

# macOS
~/Library/Logs/Claude/

# Linux
~/.config/claude/logs/
```

#### Teste Manual do MCP Server

```bash
# Teste direto do servidor
node /path/to/mcp-server/dist/index.js

# Teste de conectividade
curl -X POST http://localhost:3001 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}'
```

## 📋 Checklist de Integração

- [ ] Claude Desktop instalado
- [ ] Arquivo de configuração criado/atualizado
- [ ] Caminho do MCP Server correto
- [ ] Variáveis de ambiente configuradas
- [ ] MCP Server rodando
- [ ] Backend e Matcher funcionando
- [ ] Token interno configurado
- [ ] Claude Desktop reiniciado
- [ ] Conexão MCP verificada
- [ ] Ferramentas testadas
- [ ] Exemplos funcionando

## 🔄 Atualizações

### Atualizando o MCP Server

1. Pare o Claude Desktop
2. Atualize o código do MCP Server
3. Recompile: `yarn build`
4. Reinicie o Claude Desktop

### Atualizando Configurações

1. Edite o arquivo de configuração
2. Reinicie o Claude Desktop
3. Teste as novas configurações

---

**🎉 Integração com Claude Desktop concluída com sucesso!**

Agora você pode usar Claude para interagir naturalmente com seus dados do Home Buddy!

Próximo passo: [API e Ferramentas](./api.md)
