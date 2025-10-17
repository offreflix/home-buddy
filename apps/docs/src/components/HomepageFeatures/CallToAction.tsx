import type { ReactNode } from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import Heading from '@theme/Heading'

export default function CallToAction(): ReactNode {
  return (
    <section className="hero hero--primary">
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className="text--center">
              <Heading as="h2">🚀 Pronto para Começar?</Heading>
              <p className="hero__subtitle">
                Transforme sua gestão doméstica com inteligência artificial e
                automação. Comece agora mesmo com nossa documentação completa.
              </p>
              <div className="hero__buttons">
                <Link
                  className="button button--secondary button--lg"
                  to="/docs/getting-started/installation"
                >
                  📦 Instalação Rápida
                </Link>
                <Link
                  className="button button--outline button--lg"
                  to="/docs/architecture/overview"
                >
                  🏗️ Ver Arquitetura
                </Link>
                <Link
                  className="button button--outline button--lg"
                  to="https://github.com/home-buddy/home-buddy-monorepo"
                >
                  💻 GitHub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
