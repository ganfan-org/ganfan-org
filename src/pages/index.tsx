import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate, {translate} from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import ProductShowcase from '@site/src/components/ProductShowcase';

import styles from './index.module.css';

function HomepageHero() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx(styles.hero)}>
      <div className={clsx('container', styles.heroContainer)}>
        <div className={styles.heroLogoWrap}>
          <img
            src="img/ganfan_logo.svg"
            alt="Ganfan"
            className={styles.heroLogo}
          />
        </div>
        <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
        <p className={styles.heroTagline}>
          <Translate id="homepage.hero.tagline" description="Hero tagline">
            Warm. Restrained. Native.
          </Translate>
        </p>
        <p className={styles.heroDesc}>
          <Translate
            id="homepage.hero.description"
            description="Hero section description line 1">
            Warm, restrained, native, and privacy-first.
          </Translate>
          <br />
          <Translate
            id="homepage.hero.description2"
            description="Hero section description line 2">
            Crafted with care, bringing technology back to the essence of life.
          </Translate>
        </p>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const tagline = translate({
    id: 'homepage.hero.tagline',
    message: 'Warm. Restrained. Native.',
    description: 'Hero tagline',
  });
  const pageDescription = translate({
    id: 'homepage.meta.description',
    message: 'Ganfan — an independent product team building warm, restrained, and native apps. Crafted with care, bringing technology back to the essence of life.',
    description: 'Homepage meta description',
  });
  return (
    <Layout
      title={`${siteConfig.title} — ${tagline}`}
      description={pageDescription}>
      <HomepageHero />
      <main>
        <ProductShowcase />
      </main>
    </Layout>
  );
}
