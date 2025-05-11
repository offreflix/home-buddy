import { Injectable } from '@nestjs/common';
import { APIError, OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

@Injectable()
export class RecipesService {
  async generateWithAI(ingredients: any[]) {
    const names = ingredients.map((item) => item.name).join(', ');

    const prompt = `
    Você é um chef especializado em receitas caseiras.

    Com base APENAS nestes ingredientes: ${names}
    Gere 1 receita em formato JSON ESTRUTURADO e STRICTO conforme o exemplo abaixo. Você NÃO PODE adicionar ingredientes que não estão na lista.

    ⚠️ ATENÇÃO:
    - NÃO use "sal", "óleo", "farinha", "tempero", "água" ou QUALQUER COISA que NÃO esteja na lista.
    - Use somente o que está listado: ${names}.
    - NÃO invente ingredientes adicionais. NÃO use criatividade para adicionar nada fora da lista.

    Formato da resposta (em JSON):
    {
      "title": "Nome da Receita",
      "description": "Breve descrição da receita",
      "prepTime": "Tempo de preparo (ex: 30 min)",
      "cookTime": "Tempo de cozimento (ex: 25 min)",
      "totalTime": "Tempo total (ex: 55 min)",
      "servings": "Número de porções (ex: 4 porções)",
      "difficulty": "Fácil | Médio | Difícil",
      "category": "Ex: Sobremesas, Prato Principal, Acompanhamentos",
    
      "ingredients": [
        {productName: "Nome do Produto", quantity: "Quantidade (ex: 200)", unit: "unidade (ex: g, ml, xícara)"},
        {productName: "Nome do Produto", quantity: "Quantidade (ex: 200)", unit: "unidade (ex: g, ml, xícara)"},
        {productName: "Nome do Produto", quantity: "Quantidade (ex: 200)", unit: "unidade (ex: g, ml, xícara)"},
        ],
      "instructions": [
        "Passo 1",
        "Passo 2",
        "Passo 3"
      ],
      "tips": [
        "Dica 1",
        "Dica 2"
      ]
    }
    
    Responda SOMENTE com o JSON.
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      return JSON.parse(response.choices[0].message.content!);
    } catch (err) {
      if (err instanceof APIError) {
        if (err.status === 429)
          return {
            error:
              'Limite de uso da API atingido. Verifique sua conta no painel da OpenAI.',
          };
        if (err.status === 404)
          return {
            error:
              'Modelo não encontrado. Verifique se você tem acesso ao modelo GPT-4 ou use o GPT-3.5.',
          };
      }

      throw err;
    }
  }
}
