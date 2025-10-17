import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Home Buddy Documentation',
  tagline: 'Sistema completo de gestão doméstica inteligente',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://home-buddy-docs.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'home-buddy', // Usually your GitHub org/user name.
  projectName: 'home-buddy-monorepo', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/home-buddy/home-buddy-monorepo/tree/develop/apps/docs/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/home-buddy/home-buddy-monorepo/tree/develop/apps/docs/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Home Buddy',
      logo: {
        alt: 'Home Buddy Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentação',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          type: 'dropdown',
          label: 'Repositórios',
          position: 'right',
          items: [
            {
              label: 'Monorepo',
              href: 'https://github.com/home-buddy/home-buddy-monorepo',
            },
            {
              label: 'Frontend',
              href: 'https://github.com/home-buddy/home-buddy-monorepo/tree/develop/apps/frontend',
            },
            {
              label: 'Backend',
              href: 'https://github.com/home-buddy/home-buddy-monorepo/tree/develop/apps/backend',
            },
            {
              label: 'Matcher',
              href: 'https://github.com/home-buddy/home-buddy-monorepo/tree/develop/apps/matcher',
            },
          ],
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentação',
          items: [
            {
              label: 'Início',
              to: '/docs/intro',
            },
            {
              label: 'Guia de Instalação',
              to: '/docs/getting-started/installation',
            },
            {
              label: 'Arquitetura',
              to: '/docs/architecture/overview',
            },
          ],
        },
        {
          title: 'Serviços',
          items: [
            {
              label: 'Backend API',
              to: '/docs/backend/api-reference',
            },
            {
              label: 'Frontend',
              to: '/docs/frontend/components',
            },
            {
              label: 'Matcher',
              to: '/docs/matcher/overview',
            },
          ],
        },
        {
          title: 'Desenvolvimento',
          items: [
            {
              label: 'Contribuindo',
              to: '/docs/contributing/guidelines',
            },
            {
              label: 'Deploy',
              to: '/docs/deployment/docker',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/home-buddy/home-buddy-monorepo',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Home Buddy. Construído com Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
