import type { ReactNode } from 'react'
import clsx from 'clsx'
import Heading from '@theme/Heading'
import styles from './styles.module.css'

type FeatureItem = {
  title: string
  Svg: React.ComponentType<React.ComponentProps<'svg'>>
  description: ReactNode
}

const FeatureList: FeatureItem[] = [
  {
    title: '🤖 Inteligência Artificial',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Sistema de matching inteligente usando OpenAI GPT-4o-mini para comparar
        produtos extraídos com seu catálogo pessoal com taxa de acerto superior
        a 90%.
      </>
    ),
  },
  {
    title: '🌐 Web Scraping Automático',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Extração automática de produtos de notas fiscais online com
        processamento assíncrono usando BullMQ e interface de acompanhamento em
        tempo real.
      </>
    ),
  },
  {
    title: '⚡ Arquitetura Moderna',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Monorepo com Next.js, NestJS e FastAPI. Sistema completo de
        autenticação, filas assíncronas e rastreamento detalhado de todas as
        operações.
      </>
    ),
  },
]

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
