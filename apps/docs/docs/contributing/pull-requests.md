# Guia de Pull Requests

Este documento fornece um guia completo para criar, revisar e gerenciar Pull Requests no projeto Home Buddy.

## Visão Geral

Pull Requests são a forma principal de contribuir com código para o Home Buddy. Este guia cobre todo o processo, desde a criação até o merge, garantindo qualidade e consistência.

## Processo de Pull Request

### 1. Preparação

#### Antes de Começar

- [ ] Verifique se existe uma issue relacionada
- [ ] Confirme que a mudança está alinhada com os objetivos do projeto
- [ ] Certifique-se de que tem permissão para trabalhar na área
- [ ] Leia a documentação relevante

#### Fork e Clone

```bash
# 1. Fork o repositório no GitHub
# 2. Clone seu fork
git clone https://github.com/SEU-USUARIO/home-buddy-monorepo.git
cd home-buddy-monorepo

# 3. Adicione o repositório original como upstream
git remote add upstream https://github.com/home-buddy/home-buddy-monorepo.git

# 4. Atualize sua branch main
git checkout main
git pull upstream main
```

### 2. Criação da Branch

#### Convenções de Nomenclatura

```bash
# Features
feature/nome-da-feature
feature/user-authentication
feature/product-search

# Bug fixes
bugfix/descricao-do-bug
bugfix/login-validation-error
bugfix/api-timeout-issue

# Hotfixes
hotfix/descricao-do-hotfix
hotfix/security-vulnerability
hotfix/critical-bug

# Documentação
docs/descricao-da-doc
docs/api-documentation
docs/installation-guide

# Refatoração
refactor/descricao-da-refatoracao
refactor/database-queries
refactor/component-structure

# Chores
chore/descricao-do-chore
chore/update-dependencies
chore/ci-configuration
```

#### Criação da Branch

```bash
# 1. Certifique-se de estar na main atualizada
git checkout main
git pull upstream main

# 2. Crie uma nova branch
git checkout -b feature/nova-funcionalidade

# 3. Verifique se está na branch correta
git branch
```

### 3. Desenvolvimento

#### Workflow de Desenvolvimento

```bash
# 1. Faça suas alterações
# 2. Adicione arquivos modificados
git add .

# 3. Commit com mensagem descritiva
git commit -m "feat: add user authentication system"

# 4. Push para sua branch
git push origin feature/nova-funcionalidade
```

#### Commits Frequentes

```bash
# ✅ Bom - commits pequenos e focados
git commit -m "feat(auth): add login form component"
git commit -m "feat(auth): add form validation"
git commit -m "feat(auth): add error handling"
git commit -m "test(auth): add login form tests"

# ❌ Ruim - commit muito grande
git commit -m "feat: complete user authentication system with login, validation, error handling, tests, and documentation"
```

### 4. Criação do Pull Request

#### Template de Pull Request

```markdown
## 📋 Descrição

Breve descrição das mudanças implementadas e o problema que resolve.

## 🔧 Tipo de Mudança

- [ ] 🐛 Bug fix (mudança que corrige um problema)
- [ ] ✨ Nova feature (mudança que adiciona funcionalidade)
- [ ] 💥 Breaking change (correção ou feature que causaria mudança em funcionalidade existente)
- [ ] 📚 Documentação (mudanças apenas na documentação)
- [ ] 🎨 Estilo (mudanças que não afetam o significado do código)
- [ ] ♻️ Refatoração (mudança de código que não corrige bug nem adiciona feature)
- [ ] ⚡ Performance (mudança que melhora performance)
- [ ] ✅ Testes (adição de testes ou correção de testes existentes)
- [ ] 🔧 Chore (mudanças em ferramentas, configurações, etc.)

## 🧪 Como Testar

1. Passo 1 para testar
2. Passo 2 para testar
3. Passo 3 para testar

## 📸 Screenshots (se aplicável)

Adicione screenshots para ajudar a explicar sua mudança.

## ✅ Checklist

- [ ] Meu código segue as diretrizes de estilo do projeto
- [ ] Realizei uma auto-revisão do meu código
- [ ] Comentei meu código, especialmente em áreas difíceis de entender
- [ ] Fiz as mudanças correspondentes na documentação
- [ ] Minhas mudanças não geram novos warnings
- [ ] Adicionei testes que provam que minha correção é eficaz ou que minha feature funciona
- [ ] Testes novos e existentes passam localmente com minhas mudanças
- [ ] Quaisquer mudanças dependentes foram mergeadas e publicadas

## 🔗 Issues Relacionadas

Closes #123
Relates to #456

## 📝 Notas Adicionais

Adicione qualquer outro contexto sobre a mudança aqui.
```

#### Exemplo Completo

```markdown
## 📋 Descrição

Implementa sistema de autenticação de usuários com login local e Google OAuth.

## 🔧 Tipo de Mudança

- [x] ✨ Nova feature (mudança que adiciona funcionalidade)

## 🧪 Como Testar

1. Acesse a página de login
2. Teste login com email/senha
3. Teste login com Google
4. Verifique redirecionamento após login
5. Teste logout

## 📸 Screenshots

![Login Page](https://example.com/login-screenshot.png)
![Dashboard](https://example.com/dashboard-screenshot.png)

## ✅ Checklist

- [x] Meu código segue as diretrizes de estilo do projeto
- [x] Realizei uma auto-revisão do meu código
- [x] Comentei meu código, especialmente em áreas difíceis de entender
- [x] Fiz as mudanças correspondentes na documentação
- [x] Minhas mudanças não geram novos warnings
- [x] Adicionei testes que provam que minha correção é eficaz ou que minha feature funciona
- [x] Testes novos e existentes passam localmente com minhas mudanças
- [x] Quaisquer mudanças dependentes foram mergeadas e publicadas

## 🔗 Issues Relacionadas

Closes #45
Relates to #23

## 📝 Notas Adicionais

- Implementa JWT para autenticação
- Adiciona middleware de autenticação
- Configura Google OAuth
- Adiciona testes unitários e de integração
```

### 5. Processo de Review

#### Automated Checks

O sistema executa automaticamente:

- **Linting**: ESLint, Prettier, Black, isort
- **Type Checking**: TypeScript, mypy
- **Tests**: Jest, pytest
- **Build**: Verificação de build
- **Security**: Dependabot, CodeQL

#### Code Review

##### Critérios de Review

- **Funcionalidade**: O código faz o que deveria fazer?
- **Qualidade**: O código está bem escrito e organizado?
- **Performance**: Há problemas de performance?
- **Segurança**: Há vulnerabilidades de segurança?
- **Testes**: Há testes adequados?
- **Documentação**: A documentação foi atualizada?

##### Checklist para Reviewers

- [ ] Código está funcionalmente correto
- [ ] Código segue os padrões do projeto
- [ ] Testes são adequados e passam
- [ ] Performance foi considerada
- [ ] Segurança foi verificada
- [ ] Documentação foi atualizada
- [ ] Não há código duplicado
- [ ] Error handling está implementado
- [ ] Logging está adequado
- [ ] Acessibilidade foi considerada (frontend)

#### Tipos de Comentários

##### ✅ Aprovação

```markdown
LGTM! 🚀

O código está bem implementado, segue os padrões do projeto e os testes passam.
Aprovado para merge.
```

##### 🔄 Sugestões

````markdown
Sugestão: Considerar usar `useMemo` aqui para otimizar performance:

```typescript
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data)
}, [data])
```
````

Isso evitaria recálculos desnecessários.

````

##### ❌ Problemas

```markdown
Problema: Esta função pode lançar uma exceção não tratada.

Sugestão: Adicionar try-catch ou verificar se o valor existe antes de usar.

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  logger.error('Operation failed:', error)
  throw new AppError('Operation failed')
}
````

````

##### 🐛 Bugs

```markdown
Bug: Esta condição sempre será verdadeira.

```typescript
// ❌ Incorreto
if (user && user !== null) {

// ✅ Correto
if (user) {
````

O `&&` já verifica se user não é null/undefined.

````

### 6. Resolução de Conflitos

#### Identificando Conflitos

```bash
# Atualizar branch com upstream
git checkout main
git pull upstream main
git checkout feature/minha-feature
git rebase main

# Se houver conflitos
git status
````

#### Resolvendo Conflitos

```bash
# 1. Abra os arquivos com conflitos
# 2. Resolva os conflitos manualmente
# 3. Adicione os arquivos resolvidos
git add arquivo-resolvido.ts

# 4. Continue o rebase
git rebase --continue

# 5. Force push (cuidado!)
git push --force-with-lease origin feature/minha-feature
```

#### Marcadores de Conflito

```typescript
// Arquivo com conflito
function calculateTotal(items: Item[]) {
<<<<<<< HEAD
  return items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
=======
  let total = 0
  for (const item of items) {
    total += item.price * item.quantity
  }
  return total
>>>>>>> feature/minha-feature
}
```

### 7. Merge Strategies

#### Squash and Merge

**Quando usar**: Features pequenas, commits de limpeza

```bash
# Cria um commit único com todas as mudanças
git merge --squash feature/minha-feature
```

#### Rebase and Merge

**Quando usar**: Histórico limpo, commits bem organizados

```bash
# Aplica commits individuais sem merge commit
git rebase feature/minha-feature
```

#### Merge Commit

**Quando usar**: Features grandes, múltiplos desenvolvedores

```bash
# Cria merge commit preservando histórico
git merge feature/minha-feature
```

### 8. Pós-Merge

#### Limpeza Local

```bash
# 1. Volte para main
git checkout main

# 2. Atualize com upstream
git pull upstream main

# 3. Delete a branch local
git branch -d feature/minha-feature

# 4. Delete a branch remota (opcional)
git push origin --delete feature/minha-feature
```

#### Verificação

- [ ] Feature está funcionando em produção
- [ ] Testes estão passando
- [ ] Documentação foi atualizada
- [ ] Changelog foi atualizado
- [ ] Release notes foram preparadas

## Tipos de Pull Requests

### Feature PR

```markdown
## 🎯 Objetivo

Implementar nova funcionalidade de busca de produtos.

## 📋 Checklist

- [ ] Implementação completa
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Documentação atualizada
- [ ] Screenshots/recordings
- [ ] Performance testada
- [ ] Acessibilidade verificada
```

### Bug Fix PR

```markdown
## 🐛 Problema

Login falha com caracteres especiais na senha.

## 🔧 Solução

Implementar escape adequado de caracteres especiais.

## 📋 Checklist

- [ ] Bug reproduzido
- [ ] Fix implementado
- [ ] Testes adicionados
- [ ] Regressão testada
- [ ] Documentação atualizada
```

### Hotfix PR

```markdown
## 🚨 Urgência

Vulnerabilidade de segurança crítica.

## 🔧 Solução

Atualizar dependência vulnerável.

## 📋 Checklist

- [ ] Fix implementado
- [ ] Testes passando
- [ ] Deploy em produção
- [ ] Monitoramento ativo
- [ ] Comunicação enviada
```

### Refactor PR

```markdown
## 🔄 Objetivo

Refatorar queries do banco para melhor performance.

## 📋 Checklist

- [ ] Performance melhorada
- [ ] Testes passando
- [ ] Código mais legível
- [ ] Documentação atualizada
- [ ] Benchmark executado
```

## Troubleshooting

### Problemas Comuns

#### PR não está atualizado

```bash
# Atualizar branch com upstream
git checkout main
git pull upstream main
git checkout feature/minha-feature
git rebase main
git push --force-with-lease origin feature/minha-feature
```

#### Testes falhando

```bash
# Executar testes localmente
yarn test
yarn test:coverage

# Verificar logs específicos
yarn test --verbose

# Executar testes específicos
yarn test --testNamePattern="ProductService"
```

#### Build falhando

```bash
# Verificar erros de build
yarn build

# Verificar tipos
yarn type-check

# Verificar linting
yarn lint
yarn lint:fix
```

#### Conflitos de dependências

```bash
# Atualizar dependências
yarn install

# Verificar vulnerabilidades
yarn audit

# Atualizar dependências vulneráveis
yarn audit fix
```

### Comandos Úteis

```bash
# Ver status do PR
gh pr status

# Ver detalhes do PR
gh pr view 123

# Fazer checkout do PR
gh pr checkout 123

# Aprovar PR
gh pr review 123 --approve

# Fechar PR
gh pr close 123

# Merge PR
gh pr merge 123 --squash
```

## Métricas e KPIs

### Métricas de PR

- **Tempo médio de review**: < 24 horas
- **Taxa de aprovação**: > 80%
- **Tempo médio de merge**: < 48 horas
- **Taxa de rejeição**: < 10%

### Métricas de Qualidade

- **Cobertura de testes**: > 80%
- **Taxa de bugs em produção**: < 5%
- **Tempo de build**: < 10 minutos
- **Taxa de sucesso de deploy**: > 95%

## Ferramentas e Integrações

### GitHub Actions

```yaml
# .github/workflows/pr.yml
name: Pull Request

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: yarn install
      - run: yarn test
      - run: yarn lint
      - run: yarn type-check
```

### Code Climate

```yaml
# .codeclimate.yml
version: '2'
checks:
  argument-count:
    enabled: true
  complex-logic:
    enabled: true
  file-lines:
    enabled: true
  method-complexity:
    enabled: true
  method-lines:
    enabled: true
```

### Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
    open-pull-requests-limit: 10
```

## Boas Práticas

### Para Autores

- **Commits pequenos**: Facilita review e debugging
- **Mensagens claras**: Descreva o que e por que
- **Testes adequados**: Cubra casos de uso e edge cases
- **Documentação**: Atualize docs quando necessário
- **Responsividade**: Responda a comentários rapidamente

### Para Reviewers

- **Review rápido**: Evite bloqueios desnecessários
- **Comentários construtivos**: Seja específico e educativo
- **Aprovação clara**: Deixe claro quando está aprovado
- **Teste local**: Teste mudanças críticas localmente
- **Comunicação**: Use tom respeitoso e profissional

### Para Maintainers

- **Merge rápido**: Não deixe PRs abertos por muito tempo
- **Comunicação**: Mantenha stakeholders informados
- **Qualidade**: Mantenha padrões de qualidade
- **Documentação**: Mantenha docs atualizadas
- **Comunidade**: Promova cultura de colaboração

---

**Lembre-se**: Pull Requests são uma ferramenta de colaboração. O objetivo é melhorar o código através de revisão e discussão, não apenas aprovar mudanças.
