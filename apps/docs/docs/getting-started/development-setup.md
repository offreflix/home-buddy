---
id: development-setup
title: Setup de Desenvolvimento
sidebar_position: 2
description: Configure seu ambiente de desenvolvimento para contribuir com o Home Buddy
keywords: [desenvolvimento, setup, ide, ferramentas, home buddy]
---

# 🛠️ Setup de Desenvolvimento

Configure seu ambiente de desenvolvimento para contribuir efetivamente com o Home Buddy.

## 🎯 Objetivos do Setup

- Configurar IDE/Editor para máxima produtividade
- Configurar ferramentas de qualidade de código
- Configurar debugging e hot-reload
- Configurar testes e linting

## 💻 Configuração do Editor

### Visual Studio Code (Recomendado)

#### Extensões Essenciais

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "prisma.prisma",
    "ms-python.python",
    "ms-python.flake8",
    "ms-python.black-formatter",
    "redhat.vscode-yaml",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-docker"
  ]
}
```

#### Configurações Recomendadas

Crie `.vscode/settings.json` na raiz do projeto:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  },
  "prisma.showPrismaDataPlatformNotification": false,
  "python.defaultInterpreterPath": "./apps/matcher/venv/Scripts/python.exe",
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "python.formatting.provider": "black"
}
```

### Outros Editores

#### WebStorm/IntelliJ

- Instale plugins: TypeScript, Tailwind CSS, Prisma
- Configure ESLint e Prettier
- Configure debugger para Node.js

#### Vim/Neovim

- Use coc.nvim ou nvim-lspconfig
- Configure TypeScript LSP
- Configure Prettier e ESLint

## 🔧 Ferramentas de Desenvolvimento

### Git Hooks

Configure pre-commit hooks para qualidade de código:

```bash
# Instalar husky
yarn add -D husky

# Configurar hooks
npx husky install
npx husky add .husky/pre-commit "yarn lint-staged"
```

### Lint Staged

Configure linting automático:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

### Debugging

#### Backend (NestJS)

Configure `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/apps/backend/dist/main.js",
      "cwd": "${workspaceFolder}/apps/backend",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "runtimeExecutable": "yarn",
      "runtimeArgs": ["start:dev"]
    }
  ]
}
```

#### Frontend (Next.js)

```json
{
  "name": "Debug Frontend",
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/apps/frontend/node_modules/.bin/next",
  "args": ["dev"],
  "cwd": "${workspaceFolder}/apps/frontend",
  "console": "integratedTerminal",
  "restart": true
}
```

## 🧪 Configuração de Testes

### Backend Tests

```bash
# Executar testes
cd apps/backend
yarn test

# Testes com coverage
yarn test:cov

# Testes e2e
yarn test:e2e
```

### Frontend Tests

```bash
# Executar testes
cd apps/frontend
yarn test

# Testes com watch mode
yarn test:watch

# Coverage
yarn test:coverage
```

### Matcher Tests

```bash
# Executar testes Python
cd apps/matcher
python -m pytest

# Com coverage
python -m pytest --cov=app
```

## 📊 Monitoramento e Logs

### Logs em Desenvolvimento

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Ferramentas de Monitoramento

- **Backend**: Bull Board para filas
- **Frontend**: React DevTools
- **Database**: Prisma Studio
- **Redis**: RedisInsight

## 🔄 Hot Reload e Watch Mode

### Backend

```bash
# Desenvolvimento com hot reload
cd apps/backend
yarn start:dev
```

### Frontend

```bash
# Desenvolvimento com hot reload
cd apps/frontend
yarn dev
```

### Matcher

```bash
# Desenvolvimento com auto-reload
cd apps/matcher
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📝 Padrões de Código

### TypeScript/JavaScript

- Use ESLint + Prettier
- Configure path mapping
- Use strict mode
- Prefira interfaces sobre types

### Python

- Use Black para formatação
- Use Flake8 para linting
- Configure type hints
- Use Pydantic para validação

### CSS/Styling

- Use Tailwind CSS
- Configure design tokens
- Use CSS modules quando necessário
- Mantenha consistência visual

## 🚀 Scripts Úteis

### Package.json Raiz

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean",
    "docs:dev": "cd apps/docs && yarn start",
    "docs:build": "cd apps/docs && yarn build"
  }
}
```

### Comandos Úteis

```bash
# Desenvolvimento completo
yarn dev

# Build completo
yarn build

# Testes completos
yarn test

# Linting completo
yarn lint

# Limpar cache
yarn clean

# Documentação
yarn docs:dev
```

## 🔍 Troubleshooting

### Problemas Comuns

#### Hot Reload Não Funciona

```bash
# Verificar se watchman está instalado
brew install watchman  # macOS
# ou
sudo apt-get install watchman  # Linux
```

#### Problemas de TypeScript

```bash
# Limpar cache do TypeScript
rm -rf node_modules/.cache
yarn install
```

#### Problemas de Docker

```bash
# Limpar containers e volumes
docker-compose down -v
docker system prune -a
```

## 📚 Próximos Passos

1. **[Docker Setup](/docs/getting-started/docker-setup)** - Configure desenvolvimento com Docker
2. **[Arquitetura](/docs/architecture/overview)** - Entenda a estrutura do sistema
3. **[Contribuindo](/docs/contributing/guidelines)** - Guias para contribuir

## 🆘 Precisa de Ajuda?

- **GitHub Issues**: [Reportar problemas](https://github.com/home-buddy/home-buddy-monorepo/issues)
- **Discord**: [Comunidade](https://discord.gg/home-buddy)
- **Email**: [suporte@homebuddy.com](mailto:suporte@homebuddy.com)
