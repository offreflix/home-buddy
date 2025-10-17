import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

/**
 * Sidebar configuration for Home Buddy documentation
 *
 * This sidebar provides organized navigation through all documentation sections,
 * making it easy for developers to find relevant information quickly.
 */
const sidebars: SidebarsConfig = {
  // Main documentation sidebar
  docsSidebar: [
    // Introduction
    'intro',
    'migration-guide',

    // Getting Started
    {
      type: 'category',
      label: '🚀 Começando',
      collapsed: false,
      items: [
        'getting-started/installation',
        'getting-started/development-setup',
        'getting-started/docker-setup',
      ],
    },

    // Architecture
    {
      type: 'category',
      label: '🏗️ Arquitetura',
      collapsed: false,
      items: [
        'architecture/overview',
        'architecture/monorepo-structure',
        'architecture/services',
        'architecture/diagrams',
      ],
    },

    // Frontend
    {
      type: 'category',
      label: '🎨 Frontend',
      collapsed: true,
      items: [
        'frontend/components',
        'frontend/pages',
        'frontend/hooks',
        'frontend/styling',
      ],
    },

    // Backend
    {
      type: 'category',
      label: '⚙️ Backend',
      collapsed: true,
      items: [
        'backend/api-reference',
        'backend/authentication',
        'backend/database',
        'backend/queues',
        'backend/tracking-system',
      ],
    },

    // Matcher Service
    {
      type: 'category',
      label: '🤖 Matcher',
      collapsed: true,
      items: ['matcher/overview', 'matcher/api'],
    },

    // MCP Server
    {
      type: 'category',
      label: '🔌 MCP Server',
      collapsed: true,
      items: [
        'mcp/overview',
        'mcp/installation',
        'mcp/integration',
        'mcp/api',
        'mcp/examples',
      ],
    },

    // Deployment
    {
      type: 'category',
      label: '🚀 Deploy',
      collapsed: true,
      items: [
        'deployment/docker',
        'deployment/production',
        'deployment/monitoring',
      ],
    },

    // Contributing
    {
      type: 'category',
      label: '🤝 Contribuindo',
      collapsed: true,
      items: [
        'contributing/guidelines',
        'contributing/code-style',
        'contributing/pull-requests',
      ],
    },
  ],
}

export default sidebars
