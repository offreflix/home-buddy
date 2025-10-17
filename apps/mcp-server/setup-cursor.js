#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const os = require('os')

/**
 * Script para configurar automaticamente o Cursor com o servidor MCP do Home Buddy
 */

function getCursorConfigPath() {
  const platform = os.platform()

  switch (platform) {
    case 'win32':
      return path.join(
        os.homedir(),
        'AppData',
        'Roaming',
        'Cursor',
        'User',
        'settings.json',
      )
    case 'darwin':
      return path.join(
        os.homedir(),
        'Library',
        'Application Support',
        'Cursor',
        'User',
        'settings.json',
      )
    case 'linux':
      return path.join(
        os.homedir(),
        '.config',
        'Cursor',
        'User',
        'settings.json',
      )
    default:
      throw new Error(`Plataforma não suportada: ${platform}`)
  }
}

function getMCPConfig() {
  const currentDir = process.cwd()
  const mcpServerPath = path.join(currentDir, 'dist', 'index.js')

  return {
    'mcp.servers': {
      'home-buddy': {
        command: 'node',
        args: [mcpServerPath],
        env: {
          BACKEND_URL: 'http://localhost:3000',
          MATCHER_URL: 'http://localhost:8000',
          INTERNAL_TOKEN:
            process.env.INTERNAL_TOKEN || 'your-secure-internal-token',
          OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'sk-your-openai-key',
          REDIS_URL: 'redis://localhost:6379',
          DATABASE_URL:
            'postgresql://postgres:postgres@localhost:5432/home_buddy',
        },
      },
    },
  }
}

function setupCursor() {
  try {
    console.log('🚀 Configurando Cursor com servidor MCP Home Buddy...')

    const configPath = getCursorConfigPath()
    const configDir = path.dirname(configPath)

    // Criar diretório se não existir
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
      console.log(`📁 Diretório criado: ${configDir}`)
    }

    // Ler configuração existente ou criar nova
    let existingConfig = {}
    if (fs.existsSync(configPath)) {
      try {
        existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))
        console.log('📖 Configuração existente carregada')
      } catch (error) {
        console.log('⚠️  Erro ao ler configuração existente, criando nova')
      }
    }

    // Mesclar configurações
    const mcpConfig = getMCPConfig()
    const mergedConfig = {
      ...existingConfig,
      ...mcpConfig,
    }

    // Salvar configuração
    fs.writeFileSync(configPath, JSON.stringify(mergedConfig, null, 2))
    console.log(`✅ Configuração salva em: ${configPath}`)

    // Verificar se o build existe
    const buildPath = path.join(process.cwd(), 'dist', 'index.js')
    if (!fs.existsSync(buildPath)) {
      console.log('⚠️  Build não encontrado. Execute: yarn build')
    } else {
      console.log('✅ Build encontrado')
    }

    console.log('\n🎉 Configuração concluída!')
    console.log('\n📋 Próximos passos:')
    console.log('1. Reinicie o Cursor')
    console.log(
      '2. Verifique nas configurações MCP se aparece um indicador verde',
    )
    console.log('3. Teste no Composer: @home-buddy listar ferramentas')
  } catch (error) {
    console.error('❌ Erro na configuração:', error.message)
    process.exit(1)
  }
}

function showManualConfig() {
  const mcpConfig = getMCPConfig()

  console.log('\n📝 Configuração manual:')
  console.log('Adicione esta configuração ao arquivo de settings do Cursor:')
  console.log('\n' + JSON.stringify(mcpConfig, null, 2))
}

// Verificar argumentos
const args = process.argv.slice(2)
if (args.includes('--manual')) {
  showManualConfig()
} else {
  setupCursor()
}
