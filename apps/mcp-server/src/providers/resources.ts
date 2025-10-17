import { Resource } from '@modelcontextprotocol/sdk/types.js'
import { Config } from '../config.js'
import { HomeBuddyApiClient } from '../clients/api.js'

export class HomeBuddyResourcesProvider {
  private apiClient: HomeBuddyApiClient

  constructor(private config: Config) {
    this.apiClient = new HomeBuddyApiClient(config)
  }

  async listResources(): Promise<Resource[]> {
    return [
      {
        uri: 'homebuddy://products',
        name: 'Catálogo de Produtos',
        description: 'Acesso ao catálogo completo de produtos do usuário',
        mimeType: 'application/json',
      },
      {
        uri: 'homebuddy://categories',
        name: 'Categorias',
        description: 'Lista de categorias de produtos',
        mimeType: 'application/json',
      },
      {
        uri: 'homebuddy://stock',
        name: 'Controle de Estoque',
        description: 'Informações sobre estoque atual e desejado',
        mimeType: 'application/json',
      },
      {
        uri: 'homebuddy://tracking',
        name: 'Logs de Tracking',
        description: 'Histórico de operações e métricas',
        mimeType: 'application/json',
      },
      {
        uri: 'homebuddy://scraping-jobs',
        name: 'Jobs de Scraping',
        description: 'Status e resultados de jobs de scraping',
        mimeType: 'application/json',
      },
    ]
  }

  async readResource(uri: string): Promise<any> {
    const url = new URL(uri)

    switch (url.protocol) {
      case 'homebuddy:':
        return await this.readHomeBuddyResource(url.pathname, url.searchParams)

      default:
        throw new Error(`Protocolo não suportado: ${url.protocol}`)
    }
  }

  private async readHomeBuddyResource(
    pathname: string,
    searchParams: URLSearchParams,
  ): Promise<any> {
    const userId = searchParams.get('userId')

    if (!userId) {
      throw new Error('Parâmetro userId é obrigatório')
    }

    switch (pathname) {
      case '/products':
        return await this.apiClient.getAllProducts(parseInt(userId))

      case '/categories':
        return await this.apiClient.getAllCategories(parseInt(userId))

      case '/stock':
        return await this.apiClient.getStockInfo(parseInt(userId))

      case '/tracking':
        const period = searchParams.get('period') || 'week'
        return await this.apiClient.getTrackingData(parseInt(userId), period)

      case '/scraping-jobs':
        return await this.apiClient.getScrapingJobs(parseInt(userId))

      default:
        throw new Error(`Recurso não encontrado: ${pathname}`)
    }
  }
}
