// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const fs = require('node:fs');
const path = require('node:path');
const {themes} = require('prism-react-renderer');
// remark/rehype 插件是 ESM，经 require 后需要取 default。
const remarkMathModule = require('remark-math');
const rehypeKatexModule = require('rehype-katex');
const remarkMath = remarkMathModule.default ?? remarkMathModule;
const rehypeKatex = rehypeKatexModule.default ?? rehypeKatexModule;
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

// 书籍索引由 scripts/sync-books.mjs 生成。缺失时保持空列表，避免影响现有站点构建。
function loadBooks() {
  try {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'books-data', 'manifest.json'), 'utf8'),
    );
    return manifest.books ?? [];
  } catch {
    return [];
  }
}

const books = loadBooks();

const bookPlugins = books.map(book => [
  '@docusaurus/plugin-content-docs',
  {
    id: `book-${book.slug}`,
    path: path.join(__dirname, 'books-data', book.slug),
    routeBasePath: `books/${book.slug}`,
    sidebarPath: path.join(__dirname, 'books-data', book.slug, 'sidebar.js'),
    breadcrumbs: false,
    showLastUpdateTime: false,
    // 技术书里大量 shell 变量写作 $SHELL / $PATH，关闭单美元行内公式可避免误判；
    // 公式统一使用 $$...$$（行内可用 \\(...\\) 转义或以后扩展显式标记）。
    remarkPlugins: [[remarkMath, {singleDollarTextMath: false}]],
    rehypePlugins: [[rehypeKatex, {throwOnError: false, strict: false}]],
  },
]);

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Ganfan',
  tagline: 'Warm. Restrained. Native.',
  favicon: 'img/ganfan_logo.svg',

  // Set the production url of your site here
  url: 'https://ganfan.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ganfan-org', // Usually your GitHub org/user name.
  projectName: 'ganfan-org', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-Hans'],
    localeConfigs: {
      en: {
        label: 'English',
        htmlLang: 'en',
      },
      'zh-Hans': {
        label: '简体中文',
        htmlLang: 'zh-Hans',
      },
    },
  },

  // 每本已上架的书一个 docs 实例，各自拥有独立路由与章节侧边栏。
  plugins: bookPlugins,

  clientModules: [require.resolve('./src/clientModules.js')],

  customFields: {
    books,
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/ganfan-org/ganfan-org/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Social card image
      image: 'img/ganfan_logo.svg',
      navbar: {
        title: 'Ganfan',
        logo: {
          alt: 'Ganfan Logo',
          src: 'img/ganfan_logo.svg',
        },
        items: [
          {to: '/app', label: 'Products', position: 'left'},
          {href: 'https://games.ganfan.org', label: 'Games', position: 'left'},
          {to: '/books', label: 'Books', position: 'left'},
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/ganfan-org',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Products',
            items: [
              {
                label: 'Ganfan Journal',
                to: '/app/gfjournal',
              },
              {
                label: 'Ganfan Book',
                href: 'https://github.com/ganfan-org',
              },
              {
                label: 'Ganfan Money',
                href: 'https://github.com/ganfan-org',
              },
              {
                label: 'Ganfan Games',
                href: 'https://games.ganfan.org',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Docs',
                to: '/docs/intro',
              },
              {
                label: 'Support',
                to: '/app/support',
              },
            ],
          },
          {
            title: 'About',
            items: [
              {
                label: 'Zhihu',
                href: 'https://www.zhihu.com/people/ganfan-tech',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/ganfan-org',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Ganfan. Crafted with care.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
