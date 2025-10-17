---
id: intro
title: Bem-vindo ao Home Buddy
sidebar_position: 1
description: Sistema completo de gestão doméstica inteligente
keywords: [home buddy, gestão doméstica, monorepo, documentação]
---

# 🏠 Home Buddy

Bem-vindo à documentação do **Home Buddy**, um sistema completo de gestão doméstica inteligente desenvolvido como um monorepo moderno.

## 📋 Sobre o Projeto

O Home Buddy é uma plataforma que facilita a gestão de produtos domésticos, permitindo:

- **📦 Rastreamento de Produtos**: Monitore produtos em diferentes lojas
- **💰 Comparação de Preços**: Encontre os melhores preços automaticamente
- **📊 Análise de Gastos**: Visualize seus gastos e padrões de consumo
- **🔍 Busca Inteligente**: Encontre produtos usando IA para matching
- **📱 Interface Moderna**: Experiência de usuário intuitiva e responsiva

## 🏗️ Arquitetura do Sistema

O Home Buddy é construído como um **monorepo** com os seguintes serviços:

### 🎨 Frontend (Next.js)

- Interface moderna com React e TypeScript
- Componentes reutilizáveis com Tailwind CSS
- Páginas responsivas e otimizadas
- Hooks customizados para gerenciamento de estado

### ⚙️ Backend (NestJS)

- API RESTful robusta
- Autenticação JWT e OAuth (Google)
- Sistema de filas com Bull Queue
- Integração com banco de dados PostgreSQL
- Sistema de tracking avançado

### 🔍 Matcher (Python/FastAPI)

- Serviço de matching de produtos usando IA
- Processamento de dados de scraping
- Algoritmos de similaridade para produtos
- API dedicada para comparações

### 📊 Documentação (Docusaurus)

- Documentação completa e interativa
- Guias de desenvolvimento e deploy
- Referências de API e componentes

## 🚀 Tecnologias Principais

### Frontend

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes UI
- **React Query** - Gerenciamento de estado

### Backend

- **NestJS** - Framework Node.js
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados principal
- **Redis** - Cache e filas
- **Bull Queue** - Sistema de filas
- **JWT** - Autenticação

### Matcher

- **FastAPI** - Framework Python
- **Pydantic** - Validação de dados
- **scikit-learn** - Machine Learning
- **Pandas** - Processamento de dados

### DevOps

- **Docker** - Containerização
- **Docker Compose** - Orquestração local
- **Turbo** - Build system do monorepo
- **Yarn** - Gerenciador de pacotes

## 📚 Como Usar Esta Documentação

Esta documentação está organizada em seções para facilitar a navegação:

### 🚀 [Guia de Início](/docs/getting-started/installation)

- Instalação e configuração
- Setup de desenvolvimento
- Configuração com Docker

### 🏗️ [Arquitetura](/docs/architecture/overview)

- Visão geral do sistema
- Estrutura do monorepo
- Comunicação entre serviços

### ⚙️ [Backend](/docs/backend/api-reference)

- Referência da API
- Autenticação e autorização
- Banco de dados e migrações
- Sistema de filas
- Tracking de operações

### 🎨 [Frontend](/docs/frontend/components)

- Biblioteca de componentes
- Páginas e roteamento
- Hooks customizados
- Sistema de estilos

### 🔍 [Matcher](/docs/matcher/overview)

- Visão geral do serviço
- API de matching
- Algoritmos utilizados

### 🚀 [Deploy](/docs/deployment/docker)

- Deploy com Docker
- Configuração de produção
- Monitoramento

### 🤝 [Contribuindo](/docs/contributing/guidelines)

- Guias para contribuidores
- Padrões de código
- Processo de pull requests

## 🎯 Próximos Passos

1. **Para Desenvolvedores**: Comece com o [Guia de Instalação](/docs/getting-started/installation)
2. **Para Usuários**: Explore a [Arquitetura](/docs/architecture/overview) para entender o sistema
3. **Para Contribuidores**: Leia os [Guias de Contribuição](/docs/contributing/guidelines)

## 📞 Suporte

- **GitHub**: [home-buddy-monorepo](https://github.com/home-buddy/home-buddy-monorepo)
- **Issues**: Use o sistema de issues do GitHub para reportar bugs
- **Discussões**: Participe das discussões da comunidade

---

**Bem-vindo ao Home Buddy! 🏠✨**
