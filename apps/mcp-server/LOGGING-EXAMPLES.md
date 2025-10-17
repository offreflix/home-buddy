# Exemplos de Logging do MCP Server

## Configuração de Nível de Log

O servidor MCP agora suporta diferentes níveis de logging configuráveis via variável de ambiente:

```bash
# Logs apenas de erro
LOG_LEVEL=ERROR npm start

# Logs de warning e erro
LOG_LEVEL=WARN npm start

# Logs informativos (padrão)
LOG_LEVEL=INFO npm start

# Logs detalhados para debug
LOG_LEVEL=DEBUG npm start
```

## Exemplos de Logs

### Inicialização do Servidor (LOG_LEVEL=INFO)

```
[2024-01-15T10:30:00.000Z] [INFO] [MCP-SERVER] ⚙️ Configurações carregadas com sucesso
[2024-01-15T10:30:00.100Z] [DEBUG] [MCP-SERVER] 🔌 Provider inicializado: ToolsProvider
[2024-01-15T10:30:00.150Z] [DEBUG] [MCP-SERVER] 🔌 Provider inicializado: ResourcesProvider
[2024-01-15T10:30:00.200Z] [DEBUG] [MCP-SERVER] 🔌 Provider inicializado: PromptsProvider
[2024-01-15T10:30:00.250Z] [INFO] [MCP-SERVER] 🔄 Iniciando Home Buddy MCP Server...
[2024-01-15T10:30:00.300Z] [INFO] [MCP-SERVER] 🔗 Transporte stdio conectado
[2024-01-15T10:30:00.350Z] [INFO] [MCP-SERVER] 🚀 Home Buddy MCP Server iniciado {"version":"1.0.0","transport":"stdio","backendUrl":"http://localhost:3000","matcherUrl":"http://localhost:8000","hasMcpToken":true,"hasOpenaiKey":true,"redisUrl":"redis://localhost:6379"}
[2024-01-15T10:30:00.400Z] [INFO] [MCP-SERVER] ✅ Servidor MCP pronto para receber conexões
[2024-01-15T10:30:00.450Z] [INFO] [MCP-SERVER] 📋 Informações do ambiente: {"nodeVersion":"v20.10.0","platform":"win32","arch":"x64","pid":12345,"uptime":"0.45s"}
```

### Execução de Ferramentas (LOG_LEVEL=DEBUG)

```
[2024-01-15T10:30:05.000Z] [DEBUG] [MCP-SERVER] 📨 Requisição recebida: ListTools
[2024-01-15T10:30:05.050Z] [DEBUG] [MCP-SERVER] 📤 Requisição processada: ListTools {"duration":"50ms"}

[2024-01-15T10:30:10.000Z] [DEBUG] [MCP-SERVER] 📨 Requisição recebida: CallTool
[2024-01-15T10:30:10.010Z] [DEBUG] [MCP-SERVER] 🔧 Chamada de ferramenta: search_products {"args":{"userId":1,"query":"arroz"}}
[2024-01-15T10:30:10.500Z] [DEBUG] [MCP-SERVER] ✅ Ferramenta executada com sucesso: search_products {"duration":"490ms"}
[2024-01-15T10:30:10.510Z] [DEBUG] [MCP-SERVER] 📤 Requisição processada: CallTool {"duration":"510ms"}
```

### Acesso a Recursos (LOG_LEVEL=DEBUG)

```
[2024-01-15T10:30:15.000Z] [DEBUG] [MCP-SERVER] 📨 Requisição recebida: ListResources
[2024-01-15T10:30:15.020Z] [DEBUG] [MCP-SERVER] 📤 Requisição processada: ListResources {"duration":"20ms"}

[2024-01-15T10:30:20.000Z] [DEBUG] [MCP-SERVER] 📨 Requisição recebida: ReadResource
[2024-01-15T10:30:20.010Z] [DEBUG] [MCP-SERVER] 📄 Acesso ao recurso: homebuddy://products/123
[2024-01-15T10:30:20.100Z] [DEBUG] [MCP-SERVER] 📤 Requisição processada: ReadResource {"duration":"90ms"}
```

### Tratamento de Erros

```
[2024-01-15T10:30:25.000Z] [DEBUG] [MCP-SERVER] 🔧 Chamada de ferramenta: get_product_details {"args":{"productId":999,"userId":1}}
[2024-01-15T10:30:25.100Z] [ERROR] [MCP-SERVER] ❌ Erro na ferramenta: get_product_details {"message":"Produto não encontrado","stack":"Error: Produto não encontrado\n    at HomeBuddyToolsProvider.callTool..."}
```

### Erro Crítico do Servidor

```
[2024-01-15T10:30:30.000Z] [ERROR] [MCP-SERVER] ❌ Erro crítico no servidor MCP {"message":"Connection refused","stack":"Error: Connection refused\n    at Server.connect..."}
```

## Formato dos Logs

Todos os logs seguem o padrão:
```
[timestamp] [level] [MCP-SERVER] message {metadata}
```

- **timestamp**: ISO 8601 com milissegundos
- **level**: DEBUG, INFO, WARN, ERROR
- **MCP-SERVER**: Identificador do serviço
- **message**: Mensagem principal com emoji para facilitar identificação
- **metadata**: Objeto JSON com informações adicionais (quando aplicável)

## Benefícios do Novo Sistema de Logging

1. **Rastreabilidade**: Timestamp preciso e identificação clara do serviço
2. **Níveis configuráveis**: Ajuste o verbosidade conforme necessário
3. **Metadados estruturados**: Informações adicionais em formato JSON
4. **Performance**: Medição de tempo de execução das operações
5. **Debugging**: Logs detalhados para facilitar troubleshooting
6. **Monitoramento**: Informações de ambiente e status do servidor
7. **Emojis**: Identificação visual rápida do tipo de log
