# Deploy da Documentação Home Buddy

Este documento descreve como fazer deploy da documentação do Home Buddy usando diferentes plataformas.

## 🚀 Deploy Automático

### GitHub Actions + Vercel

O deploy automático está configurado através do GitHub Actions. Toda vez que houver push na branch `main` ou `develop`, a documentação será automaticamente deployada.

#### Configuração Necessária

1. **Vercel Account**: Crie uma conta no [Vercel](https://vercel.com)
2. **Vercel Project**: Crie um novo projeto conectado ao repositório
3. **GitHub Secrets**: Configure os seguintes secrets no GitHub:

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

#### Workflows Configurados

- **Deploy Production**: `main` branch → produção
- **Deploy Staging**: `develop` branch → preview
- **Deploy Preview**: Pull requests → preview automático

### GitHub Pages (Alternativo)

Para usar GitHub Pages como alternativa:

1. **Habilite GitHub Pages** nas configurações do repositório
2. **Configure o domínio** personalizado (opcional)
3. **O workflow** já está configurado para deploy automático

## 🔧 Deploy Manual

### Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd apps/docs
vercel --prod
```

### Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Build
yarn build

# Deploy
netlify deploy --prod --dir=build
```

### GitHub Pages

```bash
# Build
yarn build

# Deploy usando gh-pages
npx gh-pages -d build
```

## 🌐 Domínios Personalizados

### Vercel

1. **Adicione o domínio** nas configurações do projeto
2. **Configure DNS** apontando para Vercel
3. **SSL automático** será configurado

### GitHub Pages

1. **Adicione CNAME** no arquivo `apps/docs/static/CNAME`
2. **Configure DNS** apontando para GitHub Pages
3. **SSL automático** será configurado

## 📊 Monitoramento

### Vercel Analytics

- **Performance**: Métricas de carregamento
- **Usage**: Estatísticas de uso
- **Errors**: Monitoramento de erros

### Google Analytics

```javascript
// Adicionar em docusaurus.config.ts
analytics: {
  gtag: {
    trackingID: 'GA_TRACKING_ID',
    anonymizeIP: true,
  },
},
```

## 🔍 SEO e Otimização

### Meta Tags

```typescript
// docusaurus.config.ts
themeConfig: {
  metadata: [
    {name: 'keywords', content: 'home buddy, gestão doméstica, IA, scraping'},
    {name: 'description', content: 'Sistema inteligente de gestão doméstica'},
  ],
}
```

### Sitemap

O sitemap é gerado automaticamente pelo Docusaurus em `/sitemap.xml`.

### Robots.txt

Configure o arquivo `apps/docs/static/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://docs.homebuddy.com/sitemap.xml
```

## 🚨 Troubleshooting

### Build Falhando

```bash
# Verificar dependências
yarn install

# Limpar cache
yarn clean

# Build local
yarn build
```

### Deploy Falhando

1. **Verificar logs** do GitHub Actions
2. **Verificar secrets** configurados
3. **Verificar permissões** do repositório

### Links Quebrados

```bash
# Verificar links
npx broken-link-checker http://localhost:3000
```

## 📈 Performance

### Otimizações Implementadas

- **Code Splitting**: Automático pelo Docusaurus
- **Image Optimization**: Otimização automática
- **CSS Minification**: Minificação automática
- **JS Minification**: Minificação automática

### Lighthouse Score

Meta de performance:

- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 90
- **SEO**: > 95

## 🔐 Segurança

### Headers de Segurança

```typescript
// docusaurus.config.ts
themeConfig: {
  security: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
  },
}
```

### HTTPS

- **Vercel**: HTTPS automático
- **GitHub Pages**: HTTPS automático
- **Netlify**: HTTPS automático

## 📝 Manutenção

### Atualizações Regulares

- **Dependências**: Atualizar mensalmente
- **Docusaurus**: Atualizar trimestralmente
- **Conteúdo**: Revisar semestralmente

### Backup

- **Código**: GitHub (backup automático)
- **Build**: Vercel (backup automático)
- **Conteúdo**: Markdown files (versionado)

---

**Última Atualização**: Janeiro 2025  
**Versão**: 1.0.0  
**Status**: ✅ Configurado
