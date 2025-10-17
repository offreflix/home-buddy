# Diretrizes para Contribuidores

Bem-vindo ao Home Buddy! Este documento fornece diretrizes e informações essenciais para contribuir com o projeto.

## Visão Geral

O Home Buddy é um sistema de gerenciamento de estoque doméstico que utiliza inteligência artificial para automatizar o controle de produtos. Contribuímos para tornar o gerenciamento de estoque mais eficiente e inteligente.

## Como Contribuir

### 1. Reportar Bugs

#### Antes de Reportar

- Verifique se o bug já foi reportado nas [Issues](https://github.com/home-buddy/home-buddy-monorepo/issues)
- Teste com a versão mais recente do código
- Verifique se não é um problema de configuração local

#### Template para Bug Report

```markdown
**Descrição do Bug**
Uma descrição clara e concisa do que é o bug.

**Passos para Reproduzir**

1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

**Comportamento Esperado**
Uma descrição clara e concisa do que você esperava que acontecesse.

**Screenshots**
Se aplicável, adicione screenshots para ajudar a explicar seu problema.

**Ambiente:**

- OS: [e.g. Windows 10, macOS 12.0, Ubuntu 20.04]
- Browser: [e.g. Chrome 91, Firefox 89]
- Versão: [e.g. 1.0.0]

**Contexto Adicional**
Adicione qualquer outro contexto sobre o problema aqui.
```

### 2. Sugerir Melhorias

#### Template para Feature Request

```markdown
**Funcionalidade Sugerida**
Uma descrição clara e concisa da funcionalidade que você gostaria de ver implementada.

**Problema que Resolve**
Uma descrição clara e concisa de qual problema esta funcionalidade resolveria.

**Solução Proposta**
Uma descrição clara e concisa de como você gostaria que a funcionalidade funcionasse.

**Alternativas Consideradas**
Uma descrição clara e concisa de quaisquer soluções ou funcionalidades alternativas que você considerou.

**Contexto Adicional**
Adicione qualquer outro contexto ou screenshots sobre a solicitação de funcionalidade aqui.
```

### 3. Contribuir com Código

#### Processo de Contribuição

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua feature/fix
4. **Faça** suas alterações
5. **Teste** suas alterações
6. **Commit** suas alterações
7. **Push** para sua branch
8. **Abra** um Pull Request

#### Convenções de Branch

```bash
# Para features
feature/nome-da-feature

# Para bugs
bugfix/descricao-do-bug

# Para hotfixes
hotfix/descricao-do-hotfix

# Para documentação
docs/descricao-da-doc

# Para refatoração
refactor/descricao-da-refatoracao
```

#### Exemplos

```bash
feature/user-authentication
bugfix/login-validation-error
docs/api-documentation-update
refactor/database-queries-optimization
```

## Ambiente de Desenvolvimento

### Pré-requisitos

- **Node.js**: 18.x ou superior
- **Python**: 3.11 ou superior
- **Docker**: 20.x ou superior
- **Docker Compose**: 2.x ou superior
- **Git**: 2.x ou superior

### Configuração Inicial

```bash
# 1. Fork e clone o repositório
git clone https://github.com/SEU-USUARIO/home-buddy-monorepo.git
cd home-buddy-monorepo

# 2. Instalar dependências
yarn install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local

# 4. Executar em modo desenvolvimento
yarn dev
```

### Estrutura do Projeto

```
home-buddy-monorepo/
├── apps/
│   ├── frontend/          # Next.js App
│   ├── backend/           # NestJS API
│   ├── matcher/          # FastAPI Service
│   └── docs/             # Docusaurus Docs
├── packages/
│   ├── ui/               # Shared UI Components
│   ├── eslint-config/    # ESLint Configuration
│   └── typescript-config/ # TypeScript Configuration
└── tools/                # Build Tools
```

## Padrões de Código

### TypeScript/JavaScript

- Use **TypeScript** sempre que possível
- Siga as configurações do ESLint definidas no projeto
- Use **Prettier** para formatação de código
- Prefira **const** e **let** ao invés de **var**
- Use **arrow functions** quando apropriado
- Implemente **error handling** adequado

### Python

- Siga **PEP 8** para estilo de código
- Use **type hints** sempre que possível
- Documente funções e classes com **docstrings**
- Use **async/await** para operações assíncronas
- Implemente **logging** adequado

### CSS/Styling

- Use **Tailwind CSS** para estilos
- Siga a convenção de **utility-first**
- Use **CSS Modules** quando necessário
- Mantenha **responsividade** em mente
- Use **design tokens** consistentes

## Testes

### Estratégia de Testes

- **Unit Tests**: Teste funções e métodos individuais
- **Integration Tests**: Teste integração entre componentes
- **E2E Tests**: Teste fluxos completos do usuário
- **API Tests**: Teste endpoints da API

### Executar Testes

```bash
# Todos os testes
yarn test

# Testes específicos
yarn test:frontend
yarn test:backend
yarn test:matcher

# Testes com coverage
yarn test:coverage

# Testes E2E
yarn test:e2e
```

### Escrever Testes

#### Frontend (Jest + Testing Library)

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from './ProductCard'

describe('ProductCard', () => {
  it('should render product information', () => {
    const product = {
      id: 1,
      name: 'Arroz',
      quantity: 5,
      unit: 'kg'
    }

    render(<ProductCard product={product} />)

    expect(screen.getByText('Arroz')).toBeInTheDocument()
    expect(screen.getByText('5 kg')).toBeInTheDocument()
  })

  it('should call onEdit when edit button is clicked', () => {
    const product = { id: 1, name: 'Arroz' }
    const onEdit = jest.fn()

    render(<ProductCard product={product} onEdit={onEdit} />)

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))

    expect(onEdit).toHaveBeenCalledWith(product)
  })
})
```

#### Backend (Jest + Supertest)

```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

describe('ProductsController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/products (GET)', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true)
      })
  })
})
```

#### Matcher (pytest)

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_match_products():
    response = client.post(
        "/match",
        json={
            "user_id": "123",
            "products_scrap": [
                {
                    "title": "Arroz",
                    "quantity": "5",
                    "unit": "kg"
                }
            ]
        },
        headers={"X-Service-Token": "test-token"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "match" in data
    assert "unmatch" in data
    assert "llm_info" in data
```

## Documentação

### Atualizar Documentação

- Mantenha a documentação atualizada com as mudanças de código
- Use **Markdown** para documentação
- Inclua **exemplos de código** quando apropriado
- Documente **APIs** com OpenAPI/Swagger
- Atualize **READMEs** quando necessário

### Tipos de Documentação

- **README**: Visão geral do projeto
- **API Docs**: Documentação de endpoints
- **Architecture**: Documentação de arquitetura
- **Deployment**: Guias de deploy
- **Contributing**: Guias para contribuidores

## Commits

### Convenção de Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Tipos de Commit

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Mudanças na documentação
- **style**: Mudanças de formatação
- **refactor**: Refatoração de código
- **test**: Adição ou correção de testes
- **chore**: Mudanças em ferramentas ou configurações

#### Exemplos

```bash
feat(auth): add Google OAuth integration
fix(api): resolve product validation error
docs(readme): update installation instructions
style(frontend): format components with prettier
refactor(database): optimize product queries
test(backend): add user service tests
chore(deps): update dependencies to latest versions
```

### Mensagens de Commit

- Use **imperativo** ("add feature" não "added feature")
- Seja **específico** e **descritivo**
- Limite a primeira linha a **50 caracteres**
- Use o corpo para explicar **o que** e **por que**
- Referencie **issues** quando apropriado

## Pull Requests

### Antes de Abrir um PR

- [ ] Código segue os padrões do projeto
- [ ] Testes passam localmente
- [ ] Documentação foi atualizada
- [ ] Commits seguem a convenção
- [ ] Branch está atualizada com main

### Template de Pull Request

```markdown
## Descrição

Breve descrição das mudanças implementadas.

## Tipo de Mudança

- [ ] Bug fix (mudança que corrige um problema)
- [ ] Nova feature (mudança que adiciona funcionalidade)
- [ ] Breaking change (correção ou feature que causaria mudança em funcionalidade existente)
- [ ] Documentação (mudanças apenas na documentação)

## Como Testar

1. Passo 1
2. Passo 2
3. Passo 3

## Checklist

- [ ] Meu código segue as diretrizes de estilo do projeto
- [ ] Realizei uma auto-revisão do meu código
- [ ] Comentei meu código, especialmente em áreas difíceis de entender
- [ ] Fiz as mudanças correspondentes na documentação
- [ ] Minhas mudanças não geram novos warnings
- [ ] Adicionei testes que provam que minha correção é eficaz ou que minha feature funciona
- [ ] Testes novos e existentes passam localmente com minhas mudanças
- [ ] Quaisquer mudanças dependentes foram mergeadas e publicadas

## Screenshots (se aplicável)

Adicione screenshots para ajudar a explicar sua mudança.

## Contexto Adicional

Adicione qualquer outro contexto sobre a mudança aqui.
```

### Processo de Review

1. **Automated Checks**: CI/CD executa testes e verificações
2. **Code Review**: Pelo menos 1 aprovação necessária
3. **Testing**: Testes manuais quando apropriado
4. **Merge**: Após aprovação e testes passando

## Comunicação

### Canais de Comunicação

- **GitHub Issues**: Para bugs e feature requests
- **GitHub Discussions**: Para discussões gerais
- **Pull Requests**: Para discussões sobre código
- **Email**: Para questões sensíveis

### Código de Conduta

#### Nossos Compromissos

- Manter um ambiente **acolhedor e inclusivo**
- Respeitar **diferentes pontos de vista**
- Aceitar **críticas construtivas**
- Focar no **bem-estar da comunidade**
- Mostrar **empatia** com outros membros

#### Comportamento Esperado

- Usar linguagem **inclusiva e acolhedora**
- Respeitar **diferentes pontos de vista**
- Aceitar **críticas construtivas**
- Focar no que é **melhor para a comunidade**
- Mostrar **empatia** com outros membros

#### Comportamento Inaceitável

- Linguagem ou imagens **sexuais**
- **Trolling**, comentários insultuosos ou ataques pessoais
- **Assédio** público ou privado
- **Publicação** de informações privadas
- **Conduta** inadequada em ambiente profissional

## Reconhecimento

### Como Reconhecemos Contribuições

- **Contributors**: Listados no README
- **Releases**: Menção em changelogs
- **Social Media**: Reconhecimento público
- **Badges**: Contribuidor ativo

### Tipos de Contribuição

- **Código**: Features, bug fixes, refatorações
- **Documentação**: READMEs, docs, exemplos
- **Testes**: Testes unitários, integração, E2E
- **Design**: UI/UX, mockups, protótipos
- **Comunidade**: Suporte, mentoring, organização

## Suporte

### Onde Obter Ajuda

- **Documentação**: Consulte a documentação do projeto
- **Issues**: Procure por issues similares
- **Discussions**: Use GitHub Discussions
- **Community**: Participe da comunidade

### Recursos Úteis

- [Documentação do Projeto](./intro.md)
- [Guia de Instalação](../getting-started/installation.md)
- [Arquitetura do Sistema](../architecture/overview.md)
- [API Reference](../backend/api-reference.md)

## Agradecimentos

Obrigado por considerar contribuir com o Home Buddy! Suas contribuições são valiosas e ajudam a tornar o projeto melhor para todos.

---

**Lembre-se**: Contribuir com código aberto é uma experiência de aprendizado e colaboração. Não hesite em fazer perguntas e sempre seja respeitoso com outros contribuidores.
