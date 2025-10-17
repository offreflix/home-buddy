#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'
import { HomeBuddyToolsProvider } from './providers/tools.js'
import { HomeBuddyResourcesProvider } from './providers/resources.js'
import { HomeBuddyPromptsProvider } from './providers/prompts.js'
import { Config } from './config.js'
import { Logger, LogLevel } from './logger.js'

// Configuração do servidor MCP
const config = new Config()
const logger = new Logger(config)

// Inicialização do servidor
const server = new Server(
  {
    name: 'home-buddy-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  },
)

// Providers
logger.configLoaded()
const toolsProvider = new HomeBuddyToolsProvider(config)
logger.providerInitialized('ToolsProvider')

const resourcesProvider = new HomeBuddyResourcesProvider(config)
logger.providerInitialized('ResourcesProvider')

const promptsProvider = new HomeBuddyPromptsProvider(config)
logger.providerInitialized('PromptsProvider')

// Registro de handlers
server.setRequestHandler(ListToolsRequestSchema, async (request) => {
  const startTime = Date.now()
  logger.requestReceived('ListTools')
  
  try {
    const result = {
      tools: await toolsProvider.listTools(),
    }
    logger.requestProcessed('ListTools', Date.now() - startTime)
    return result
  } catch (error) {
    logger.error('Erro ao listar ferramentas', { error: error instanceof Error ? error.message : error })
    throw error
  }
})

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const startTime = Date.now()
  const toolName = request.params.name
  logger.toolCall(toolName, request.params.arguments)
  
  try {
    const result = await toolsProvider.callTool(
      request.params.name,
      request.params.arguments,
    )
    logger.toolSuccess(toolName, Date.now() - startTime)
    return result
  } catch (error) {
    logger.toolError(toolName, error instanceof Error ? error : new Error(String(error)))
    throw error
  }
})

server.setRequestHandler(ListResourcesRequestSchema, async (request) => {
  const startTime = Date.now()
  logger.requestReceived('ListResources')
  
  try {
    const result = {
      resources: await resourcesProvider.listResources(),
    }
    logger.requestProcessed('ListResources', Date.now() - startTime)
    return result
  } catch (error) {
    logger.error('Erro ao listar recursos', { error: error instanceof Error ? error.message : error })
    throw error
  }
})

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const startTime = Date.now()
  const uri = request.params.uri
  logger.resourceAccess(uri)
  
  try {
    const result = await resourcesProvider.readResource(uri)
    logger.requestProcessed('ReadResource', Date.now() - startTime)
    return result
  } catch (error) {
    logger.error('Erro ao ler recurso', { uri, error: error instanceof Error ? error.message : error })
    throw error
  }
})

// Inicialização do transporte
async function main() {
  try {
    logger.info('🔄 Iniciando Home Buddy MCP Server...')
    
    const transport = new StdioServerTransport()
    await server.connect(transport)
    
    logger.transportConnected()
    logger.serverStart()
    logger.serverReady()
    
    // Log de informações do ambiente
    logger.info('📋 Informações do ambiente:', {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      uptime: `${process.uptime()}s`,
    })
    
  } catch (error) {
    logger.serverError(error instanceof Error ? error : new Error(String(error)))
    throw error
  }
}

main().catch((error) => {
  logger.serverError(error instanceof Error ? error : new Error(String(error)))
  process.exit(1)
})
