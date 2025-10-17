import { Tool } from '@modelcontextprotocol/sdk/types.js'
import { Config } from '../config.js'
import { HomeBuddyApiClient } from '../clients/api.js'

export class HomeBuddyToolsProvider {
  private apiClient: HomeBuddyApiClient

  constructor(private config: Config) {
    this.apiClient = new HomeBuddyApiClient(config)
  }

  async listTools(): Promise<Tool[]> {
    return [
      {
        name: 'search_products',
        description:
          'Busca produtos no catálogo do usuário com filtros avançados',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Termo de busca para produtos',
            },
            categoryId: {
              type: 'number',
              description: 'ID da categoria para filtrar',
            },
            userId: {
              type: 'number',
              description: 'ID do usuário',
            },
            limit: {
              type: 'number',
              description: 'Número máximo de resultados',
              default: 10,
            },
          },
          required: ['userId'],
        },
      },
      {
        name: 'get_product_details',
        description: 'Obtém detalhes completos de um produto específico',
        inputSchema: {
          type: 'object',
          properties: {
            productId: {
              type: 'number',
              description: 'ID do produto',
            },
            userId: {
              type: 'number',
              description: 'ID do usuário',
            },
          },
          required: ['productId', 'userId'],
        },
      },
      {
        name: 'update_stock',
        description: 'Atualiza o estoque de um produto',
        inputSchema: {
          type: 'object',
          properties: {
            productId: {
              type: 'number',
              description: 'ID do produto',
            },
            userId: {
              type: 'number',
              description: 'ID do usuário',
            },
            quantity: {
              type: 'number',
              description: 'Nova quantidade em estoque',
            },
            operation: {
              type: 'string',
              enum: ['add', 'subtract', 'set'],
              description: 'Tipo de operação no estoque',
            },
          },
          required: ['productId', 'userId', 'quantity', 'operation'],
        },
      },
      {
        name: 'scrape_receipt',
        description: 'Inicia scraping de uma nota fiscal online',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL da nota fiscal online',
            },
            userId: {
              type: 'number',
              description: 'ID do usuário',
            },
          },
          required: ['url', 'userId'],
        },
      },
      {
        name: 'match_products',
        description: 'Executa matching inteligente de produtos usando IA',
        inputSchema: {
          type: 'object',
          properties: {
            scrapedProducts: {
              type: 'array',
              description: 'Lista de produtos extraídos',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  code: { type: 'string' },
                  quantity: { type: 'number' },
                  unit: { type: 'string' },
                  unitPrice: { type: 'number' },
                  totalPrice: { type: 'number' },
                },
              },
            },
            userId: {
              type: 'number',
              description: 'ID do usuário',
            },
          },
          required: ['scrapedProducts', 'userId'],
        },
      },
      {
        name: 'get_categories',
        description: 'Lista todas as categorias do usuário',
        inputSchema: {
          type: 'object',
          properties: {
            userId: {
              type: 'number',
              description: 'ID do usuário',
            },
          },
          required: ['userId'],
        },
      },
      {
        name: 'get_tracking_stats',
        description: 'Obtém estatísticas de tracking e operações',
        inputSchema: {
          type: 'object',
          properties: {
            userId: {
              type: 'number',
              description: 'ID do usuário',
            },
            period: {
              type: 'string',
              enum: ['day', 'week', 'month'],
              description: 'Período para as estatísticas',
              default: 'week',
            },
          },
          required: ['userId'],
        },
      },
    ]
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'search_products':
        return await this.apiClient.searchProducts(args)

      case 'get_product_details':
        return await this.apiClient.getProductDetails(args)

      case 'update_stock':
        return await this.apiClient.updateStock(args)

      case 'scrape_receipt':
        return await this.apiClient.scrapeReceipt(args)

      case 'match_products':
        return await this.apiClient.matchProducts(args)

      case 'get_categories':
        return await this.apiClient.getCategories(args)

      case 'get_tracking_stats':
        return await this.apiClient.getTrackingStats(args)

      default:
        throw new Error(`Ferramenta desconhecida: ${name}`)
    }
  }
}
