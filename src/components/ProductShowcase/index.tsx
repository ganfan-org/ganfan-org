import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

type ProductItem = {
  title: string;
  subtitle: JSX.Element;
  icon: string;
  description: JSX.Element;
  link: string;
  platform: string;
};

const ProductList: ProductItem[] = [
  {
    title: 'Ganfan Journal',
    subtitle: (
      <Translate id="product.gfjournal.subtitle" description="Ganfan Journal subtitle">
        Personal Journal
      </Translate>
    ),
    icon: 'img/icon-journal.svg',
    description: (
      <Translate id="product.gfjournal.description" description="Ganfan Journal description">
        A simple and elegant journaling app that makes recording your life effortless and beautiful. Supports iCloud sync, mood tracking, and full-text search.
      </Translate>
    ),
    link: '/app/gfjournal',
    platform: 'iOS · macOS',
  },
  {
    title: 'Ganfan Book',
    subtitle: (
      <Translate id="product.gfbook.subtitle" description="Ganfan Book subtitle">
        Desktop Bookshelf
      </Translate>
    ),
    icon: 'img/icon-book.svg',
    description: (
      <Translate id="product.gfbook.description" description="Ganfan Book description">
        A native desktop e-book reader for a focused reading experience. Supports multiple formats, bookshelf management, and reading progress sync.
      </Translate>
    ),
    link: 'https://github.com/ganfan-org',
    platform: 'macOS · Windows · Linux',
  },
  {
    title: 'Ganfan Money',
    subtitle: (
      <Translate id="product.gfmoney.subtitle" description="Ganfan Money subtitle">
        Lightweight Expense Tracker
      </Translate>
    ),
    icon: 'img/icon-money.svg',
    description: (
      <Translate id="product.gfmoney.description" description="Ganfan Money description">
        A warm and restrained expense tracking app that makes finance management simple and natural. Native experience, privacy-first — your data belongs only to you.
      </Translate>
    ),
    link: 'https://github.com/ganfan-org',
    platform: 'iOS · macOS',
  },
  {
    title: 'Ganfan Games',
    subtitle: (
      <Translate id="product.games.subtitle" description="Ganfan Games subtitle">
        Web Mini Games
      </Translate>
    ),
    icon: 'img/icon-games.svg',
    description: (
      <Translate id="product.games.description" description="Ganfan Games description">
        A collection of fun and casual web mini games. Play instantly, no download needed — enjoy a quick break from the busy day.
      </Translate>
    ),
    link: 'https://games.ganfan.org',
    platform: 'Web',
  },
];

function ProductCard({title, subtitle, icon, description, link, platform}: ProductItem) {
  return (
    <div className={clsx('col col--6', styles.productCol)}>
      <a href={link} className={styles.productCard}>
        <div className={styles.productIconWrap}>
          <img src={icon} alt={title} className={styles.productIcon} />
        </div>
        <div className={styles.productContent}>
          <div className={styles.productHeader}>
            <h3 className={styles.productTitle}>{title}</h3>
            <span className={styles.productSubtitle}>{subtitle}</span>
          </div>
          <p className={styles.productDesc}>{description}</p>
          <div className={styles.productFooter}>
            <span className={styles.productPlatform}>{platform}</span>
            <span className={styles.productArrow}>→</span>
          </div>
        </div>
      </a>
    </div>
  );
}

export default function ProductShowcase(): JSX.Element {
  return (
    <section className={styles.products}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>
            <Translate id="homepage.products.eyebrow" description="Products section eyebrow">
              Products
            </Translate>
          </span>
          <h2 className={styles.sectionTitle}>
            <Translate id="homepage.products.title" description="Products section title">
              Our Products
            </Translate>
          </h2>
          <p className={styles.sectionDesc}>
            <Translate id="homepage.products.description" description="Products section description">
              Warm, restrained, and native — every product is crafted with care, bringing technology back to the essence of life.
            </Translate>
          </p>
        </div>
        <div className="row">
          {ProductList.map((props, idx) => (
            <ProductCard key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
