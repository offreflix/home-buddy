import { Config } from './config.js'

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private config: Config
  private logLevel: LogLevel

  constructor(config: Config, logLevel?: LogLevel) {
    this.config = config
    this.logLevel = logLevel || this.getLogLevelFromConfig()
  }

  private getLogLevelFromConfig(): LogLevel {
    const configLevel = this.config.logLevel.toUpperCase()
    switch (configLevel) {
      case 'DEBUG': return LogLevel.DEBUG
      case 'INFO': return LogLevel.INFO
      case 'WARN': return LogLevel.WARN
      case 'ERROR': return LogLevel.ERROR
      default: return LogLevel.INFO
    }
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString()
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : ''
    return `[${timestamp}] [${level}] [MCP-SERVER] ${message}${metaStr}`
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel
  }

  debug(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.error(this.formatMessage('DEBUG', message, meta))
    }
  }

  info(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.error(this.formatMessage('INFO', message, meta))
    }
  }

  warn(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.error(this.formatMessage('WARN', message, meta))
    }
  }

  error(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message, meta))
    }
  }

  // Métodos específicos para o MCP Server
  serverStart(port?: string): void {
    this.info('🚀 Home Buddy MCP Server iniciado', {
      version: '1.0.0',
      transport: 'stdio',
      backendUrl: this.config.backendUrl,
      matcherUrl: this.config.matcherUrl,
      hasPatToken: !!this.config.patToken,
      hasOpenaiKey: !!this.config.openaiApiKey,
      redisUrl: this.config.redisUrl,
    })
  }

  serverReady(): void {
    this.info('✅ Servidor MCP pronto para receber conexões')
  }

  serverError(error: Error): void {
    this.error('❌ Erro crítico no servidor MCP', {
      message: error.message,
      stack: error.stack,
    })
  }

  toolCall(toolName: string, args?: any): void {
    this.debug(`🔧 Chamada de ferramenta: ${toolName}`, { args })
  }

  toolSuccess(toolName: string, duration: number): void {
    this.debug(`✅ Ferramenta executada com sucesso: ${toolName}`, { duration: `${duration}ms` })
  }

  toolError(toolName: string, error: Error): void {
    this.error(`❌ Erro na ferramenta: ${toolName}`, {
      message: error.message,
      stack: error.stack,
    })
  }

  resourceAccess(uri: string): void {
    this.debug(`📄 Acesso ao recurso: ${uri}`)
  }

  configLoaded(): void {
    this.info('⚙️ Configurações carregadas com sucesso')
  }

  providerInitialized(providerName: string): void {
    this.debug(`🔌 Provider inicializado: ${providerName}`)
  }

  transportConnected(): void {
    this.info('🔗 Transporte stdio conectado')
  }

  requestReceived(type: string): void {
    this.debug(`📨 Requisição recebida: ${type}`)
  }

  requestProcessed(type: string, duration: number): void {
    this.debug(`📤 Requisição processada: ${type}`, { duration: `${duration}ms` })
  }
}
