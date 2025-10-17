import type { ReactNode } from 'react'
import clsx from 'clsx'
import Heading from '@theme/Heading'
import Link from '@docusaurus/Link'
import styles from './styles.module.css'

type AdditionalFeatureItem = {
  title: string
  description: ReactNode
  link: string
  icon: string
}

const AdditionalFeatureList: AdditionalFeatureItem[] = [
  {
    title: '📦 Gestão de Produtos',
    description:
      'Cadastre e organize todos os seus produtos domésticos com categorias personalizadas e controle de estoque inteligente.',
    link: '/docs/frontend/components',
    icon: '📦',
  },
  {
    title: '🔐 Autenticação Robusta',
    description:
      'Sistema de login seguro com Google OAuth e JWT, incluindo refresh tokens e middleware de proteção.',
    link: '/docs/backend/authentication',
    icon: '🔐',
  },
  {
    title: '📊 Dashboard Analítico',
    description:
      'Visualize estatísticas e insights sobre seus produtos com gráficos interativos e métricas em tempo real.',
    link: '/docs/frontend/pages',
    icon: '📊',
  },
  {
    title: '🚀 Deploy Simplificado',
    description:
      'Deploy automático com Docker Compose, incluindo PostgreSQL, Redis e todos os serviços necessários.',
    link: '/docs/deployment/docker',
    icon: '🚀',
  },
  {
    title: '📈 Sistema de Tracking',
    description:
      'Monitoramento detalhado de todas as operações, custos com IA e performance do sistema.',
    link: '/docs/backend/tracking-system',
    icon: '📈',
  },
  {
    title: '🤝 Contribuição Aberta',
    description:
      'Projeto open source com guias completos para contribuidores, incluindo padrões de código e PRs.',
    link: '/docs/contributing/guidelines',
    icon: '🤝',
  },
]

function AdditionalFeature({
  title,
  description,
  link,
  icon,
}: AdditionalFeatureItem) {
  return (
    <div className={clsx('col col--4 margin-bottom--lg')}>
      <div className="card">
        <div className="card__header">
          <div className="text--center">
            <span className="hero__subtitle" style={{ fontSize: '2rem' }}>
              {icon}
            </span>
            <Heading as="h3" className="margin-top--sm">
              {title}
            </Heading>
          </div>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <Link className="button button--primary button--block" to={link}>
            Saiba Mais
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdditionalFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <div className="text--center margin-bottom--lg">
              <Heading as="h2">Funcionalidades Principais</Heading>
              <p className="hero__subtitle">
                Explore todas as capacidades do Home Buddy
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          {AdditionalFeatureList.map((props, idx) => (
            <AdditionalFeature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
