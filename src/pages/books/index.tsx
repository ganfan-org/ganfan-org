import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

type Book = {
  slug: string;
  title: string;
  description: string;
  author: string;
  category: string;
  tags: string[];
  cover: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  chapterCount: number;
  url: string;
};

function BookCover({book}: {book: Book}) {
  const tone = book.category === '实践' ? styles.coverPractice : styles.coverTech;
  if (book.cover) {
    return (
      <div className={styles.cover}>
        <img src={book.cover} alt={`${book.title} 封面`} className={styles.coverImage} />
      </div>
    );
  }
  return (
    <div className={clsx(styles.cover, styles.coverPlaceholder, tone)}>
      <span className={styles.coverBrand}>GANFAN</span>
      <span className={styles.coverTitle}>{book.title}</span>
      <span className={styles.coverRule} />
    </div>
  );
}

function BookCard({book}: {book: Book}) {
  return (
    <Link to={book.url} className={styles.card}>
      <BookCover book={book} />
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.category}>{book.category || '书籍'}</span>
          <span className={styles.metaDot}>·</span>
          <span>{book.chapterCount} 章</span>
          {book.updatedAt && (
            <>
              <span className={styles.metaDot}>·</span>
              <span>更新于 {book.updatedAt}</span>
            </>
          )}
        </div>
        <h2 className={styles.cardTitle}>{book.title}</h2>
        {book.description && <p className={styles.cardDesc}>{book.description}</p>}
        <div className={styles.cardFooter}>
          <div className={styles.tags}>
            {book.tags.map(tag => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          <span className={styles.arrow}>→</span>
        </div>
      </div>
    </Link>
  );
}

export default function Books(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const books = ((siteConfig.customFields?.books ?? []) as Book[]).slice().sort(
    (a, b) => a.order - b.order,
  );
  const categories = useMemo(
    () => ['全部', ...new Set(books.map(book => book.category).filter(Boolean))],
    [books],
  );
  const [activeCategory, setActiveCategory] = useState('全部');
  const visibleBooks =
    activeCategory === '全部'
      ? books
      : books.filter(book => book.category === activeCategory);

  return (
    <Layout title="Books" description="Ganfan 书籍 — 技术、实践与思考的长期记录。">
      <header className={styles.hero}>
        <div className="container">
          <span className={styles.eyebrow}>Books</span>
          <h1 className={styles.heroTitle}>书籍</h1>
          <p className={styles.heroDesc}>
            在这里读书。技术笔记、实践记录与思考，都会在自己的书里慢慢生长。
          </p>
        </div>
      </header>

      <main className={clsx('container', styles.main)}>
        {books.length === 0 ? (
          <p className={styles.empty}>还没有上架的书籍。</p>
        ) : (
          <>
            {categories.length > 2 && (
              <div className={styles.filters}>
                {categories.map(category => (
                  <button
                    key={category}
                    type="button"
                    className={clsx(
                      styles.filter,
                      activeCategory === category && styles.filterActive,
                    )}
                    onClick={() => setActiveCategory(category)}>
                    {category}
                  </button>
                ))}
              </div>
            )}
            <div className={styles.grid}>
              {visibleBooks.map(book => (
                <BookCard key={book.slug} book={book} />
              ))}
            </div>
          </>
        )}
      </main>
    </Layout>
  );
}
