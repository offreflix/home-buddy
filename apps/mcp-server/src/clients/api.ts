import axios, { AxiosInstance } from 'axios'
import { Config } from '../config.js'

export class HomeBuddyApiClient {
  private backendClient: AxiosInstance
  private matcherClient: AxiosInstance

  constructor(private config: Config) {
    // Usar PAT se disponível, senão usar token interno
    const authToken = config.patToken || config.internalToken
    const authHeader = config.patToken
      ? { Authorization: `Bearer ${authToken}` }
      : { 'X-Service-Token': authToken }

    this.backendClient = axios.create({
      baseURL: config.backendUrl,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      timeout: 30000,
    })

    this.matcherClient = axios.create({
      baseURL: config.matcherUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Token': config.internalToken,
      },
      timeout: 60000,
    })
  }

  // Métodos para produtos
  async searchProducts(args: any) {
    // Usar a rota MCP que usa token de autenticação
    const response = await this.backendClient.get('/products/mcp')

    let products = response.data

    // Filtrar produtos se houver query
    if (args.query) {
      products = products.filter(
        (product: any) =>
          product.name.toLowerCase().includes(args.query.toLowerCase()) ||
          product.description?.toLowerCase().includes(args.query.toLowerCase()),
      )
    }

    // Filtrar por categoria se especificada
    if (args.categoryId) {
      products = products.filter(
        (product: any) => product.categoryId === args.categoryId,
      )
    }

    // Limitar resultados
    if (args.limit) {
      products = products.slice(0, args.limit)
    }

    return {
      content: [
        {
          type: 'text',
          text: `Encontrados ${products.length} produtos:\n${JSON.stringify(products, null, 2)}`,
        },
      ],
    }
  }

  async getProductDetails(args: any) {
    const response = await this.backendClient.get(
      `/products/mcp/${args.productId}`,
    )
    return {
      content: [
        {
          type: 'text',
          text: `Detalhes do produto:\n${JSON.stringify(response.data, null, 2)}`,
        },
      ],
    }
  }

  async getAllProducts(userId: number) {
    const response = await this.backendClient.get('/products/mcp')
    return {
      contents: [
        {
          uri: 'homebuddy://products',
          mimeType: 'application/json',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    }
  }

  async updateStock(args: any) {
    const response = await this.backendClient.patch(
      `/products/update-stock/${args.productId}`,
      {
        quantity: args.quantity,
        operation: args.operation,
      },
    )

    return {
      content: [
        {
          type: 'text',
          text: `Estoque atualizado com sucesso:\n${JSON.stringify(response.data, null, 2)}`,
        },
      ],
    }
  }

  // Métodos para categorias
  async getCategories(args: any) {
    const response = await this.backendClient.get('/categories/mcp')
    return {
      content: [
        {
          type: 'text',
          text: `Categorias disponíveis:\n${JSON.stringify(response.data, null, 2)}`,
        },
      ],
    }
  }

  async getAllCategories(userId: number) {
    const response = await this.backendClient.get('/categories/mcp')
    return {
      contents: [
        {
          uri: 'homebuddy://categories',
          mimeType: 'application/json',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    }
  }

  // Métodos para scraping
  async scrapeReceipt(args: any) {
    const response = await this.backendClient.post('/scrapping/queue', {
      url: args.url,
      userId: args.userId,
    })

    return {
      content: [
        {
          type: 'text',
          text: `Scraping iniciado com sucesso!\nJob ID: ${response.data.jobId}\nStatus: ${response.data.status}`,
        },
      ],
    }
  }

  async getScrapingJobs(userId: number) {
    const response = await this.backendClient.get('/scrapping/queue/stats')
    return {
      contents: [
        {
          uri: 'homebuddy://scraping-jobs',
          mimeType: 'application/json',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    }
  }

  // Métodos para matching
  async matchProducts(args: any) {
    const response = await this.matcherClient.post('/match', {
      user_id: args.userId.toString(),
      products_scrap: args.scrapedProducts,
    })

    return {
      content: [
        {
          type: 'text',
          text: `Matching concluído!\nMatches: ${response.data.match.length}\nUnmatches: ${response.data.unmatch.length}\n\nDetalhes:\n${JSON.stringify(response.data, null, 2)}`,
        },
      ],
    }
  }

  // Métodos para tracking
  async getTrackingStats(args: any) {
    const params = new URLSearchParams()
    if (args.period) params.append('period', args.period)

    const response = await this.backendClient.get(
      `/tracking/stats?${params.toString()}`,
    )
    return {
      content: [
        {
          type: 'text',
          text: `Estatísticas de tracking:\n${JSON.stringify(response.data, null, 2)}`,
        },
      ],
    }
  }

  async getTrackingData(userId: number, period: string) {
    const params = new URLSearchParams()
    params.append('period', period)

    const response = await this.backendClient.get(
      `/tracking/stats?${params.toString()}`,
    )
    return {
      contents: [
        {
          uri: 'homebuddy://tracking',
          mimeType: 'application/json',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    }
  }

  // Métodos para estoque
  async getStockInfo(userId: number) {
    const response = await this.backendClient.get(
      `/products?userId=${userId}&includeStock=true`,
    )
    return {
      contents: [
        {
          uri: 'homebuddy://stock',
          mimeType: 'application/json',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    }
  }
}
