import type { ReactNode } from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import HomepageFeatures from '@site/src/components/HomepageFeatures'
import AdditionalFeatures from '@site/src/components/HomepageFeatures/AdditionalFeatures'
import CallToAction from '@site/src/components/HomepageFeatures/CallToAction'
import Heading from '@theme/Heading'

import styles from './index.module.css'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Começar Agora - 5min ⏱️
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/docs/getting-started/installation"
          >
            Guia de Instalação 📦
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`${siteConfig.title} - Sistema Inteligente de Gestão Doméstica`}
      description="Documentação completa do Home Buddy - Sistema de gestão doméstica com IA, web scraping e controle de estoque inteligente."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <AdditionalFeatures />
        <CallToAction />
      </main>
    </Layout>
  )
}
