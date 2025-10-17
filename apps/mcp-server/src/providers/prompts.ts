import { Prompt } from '@modelcontextprotocol/sdk/types.js'
import { Config } from '../config.js'

export class HomeBuddyPromptsProvider {
  constructor(private config: Config) {}

  async listPrompts(): Promise<Prompt[]> {
    return [
      {
        name: 'product_analysis',
        description: 'Analisa produtos e sugere melhorias no catálogo',
        arguments: [
          {
            name: 'userId',
            description: 'ID do usuário',
            required: true,
          },
          {
            name: 'focus',
            description:
              'Área de foco da análise (estoque, categorias, preços)',
            required: false,
          },
        ],
      },
      {
        name: 'shopping_suggestions',
        description:
          'Gera sugestões inteligentes de compras baseadas no estoque',
        arguments: [
          {
            name: 'userId',
            description: 'ID do usuário',
            required: true,
          },
          {
            name: 'budget',
            description: 'Orçamento disponível',
            required: false,
          },
        ],
      },
      {
        name: 'receipt_analysis',
        description: 'Analisa uma nota fiscal e fornece insights',
        arguments: [
          {
            name: 'receiptData',
            description: 'Dados da nota fiscal',
            required: true,
          },
          {
            name: 'userId',
            description: 'ID do usuário',
            required: true,
          },
        ],
      },
      {
        name: 'inventory_optimization',
        description: 'Sugere otimizações no controle de estoque',
        arguments: [
          {
            name: 'userId',
            description: 'ID do usuário',
            required: true,
          },
          {
            name: 'timeframe',
            description: 'Período para análise (semana, mês, trimestre)',
            required: false,
          },
        ],
      },
    ]
  }

  async getPrompt(name: string, args: Record<string, any>): Promise<string> {
    switch (name) {
      case 'product_analysis':
        return this.getProductAnalysisPrompt(args)

      case 'shopping_suggestions':
        return this.getShoppingSuggestionsPrompt(args)

      case 'receipt_analysis':
        return this.getReceiptAnalysisPrompt(args)

      case 'inventory_optimization':
        return this.getInventoryOptimizationPrompt(args)

      default:
        throw new Error(`Prompt desconhecido: ${name}`)
    }
  }

  private getProductAnalysisPrompt(args: Record<string, any>): string {
    return `# Análise de Produtos - Home Buddy

Você é um especialista em gestão doméstica e análise de produtos. Analise o catálogo de produtos do usuário ${args.userId} e forneça insights valiosos.

${args.focus ? `Foque especialmente em: ${args.focus}` : ''}

Considere:
- Diversidade de categorias
- Padrões de consumo
- Otimização de estoque
- Oportunidades de economia
- Sugestões de organização

Forneça uma análise estruturada com:
1. Resumo executivo
2. Pontos fortes identificados
3. Áreas de melhoria
4. Recomendações específicas
5. Próximos passos sugeridos`
  }

  private getShoppingSuggestionsPrompt(args: Record<string, any>): string {
    return `# Sugestões Inteligentes de Compras - Home Buddy

Analise o estoque atual do usuário ${args.userId} e gere sugestões de compras personalizadas.

${args.budget ? `Orçamento disponível: R$ ${args.budget}` : ''}

Considere:
- Produtos com estoque baixo
- Padrões históricos de consumo
- Sazonalidade
- Relação custo-benefício
- Necessidades nutricionais (se aplicável)

Forneça:
1. Lista prioritária de compras
2. Estimativa de custos
3. Justificativa para cada item
4. Dicas de economia
5. Alternativas mais baratas (quando aplicável)`
  }

  private getReceiptAnalysisPrompt(args: Record<string, any>): string {
    return `# Análise de Nota Fiscal - Home Buddy

Analise os dados da nota fiscal fornecidos e extraia insights valiosos para o usuário ${args.userId}.

Dados da nota fiscal:
${JSON.stringify(args.receiptData, null, 2)}

Forneça análise sobre:
1. Resumo da compra
2. Categorias de produtos
3. Comparação com compras anteriores
4. Oportunidades de economia
5. Sugestões de otimização
6. Alertas sobre produtos não cadastrados
7. Recomendações para próximas compras`
  }

  private getInventoryOptimizationPrompt(args: Record<string, any>): string {
    return `# Otimização de Estoque - Home Buddy

Analise o controle de estoque do usuário ${args.userId} e sugira melhorias.

${args.timeframe ? `Período de análise: ${args.timeframe}` : ''}

Considere:
- Rotatividade de produtos
- Padrões de consumo
- Custos de armazenamento
- Prevenção de desperdício
- Otimização de espaço

Forneça:
1. Análise do estoque atual
2. Identificação de gargalos
3. Sugestões de ajustes
4. Estratégias de reposição
5. Métricas de acompanhamento
6. Plano de implementação`
  }
}
