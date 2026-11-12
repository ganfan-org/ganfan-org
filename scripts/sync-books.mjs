// 书籍同步脚本（原型）
//
// 读取 books.config.json 中的发布白名单，把对应 gfbook 书库转换为 Docusaurus
// 可渲染的结构，输出到 books-data/（该目录不提交）。官网只保存索引与展示外壳，
// 书稿仍留在各书自己的仓库中。
//
// 用法：node scripts/sync-books.mjs
// 原型阶段支持 source 指向本地 gfbook 目录（含 gfbook.yaml / chapters / assets）。

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as yaml from 'js-yaml';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(rootDir, 'books.config.json');
const outputDir = path.join(rootDir, 'books-data');
const staticCoverDir = path.join(rootDir, 'static', 'img', 'books');

const warnings = [];

function expandPath(input) {
  if (input.startsWith('~/')) return path.join(os.homedir(), input.slice(2));
  return path.resolve(rootDir, input);
}

function formatDate(timestamp) {
  if (!timestamp) return '';
  const ms = timestamp < 1e12 ? timestamp * 1000 : timestamp;
  if (!ms) return '';
  return new Date(ms).toISOString().slice(0, 10);
}

function yamlString(value) {
  return JSON.stringify(String(value ?? ''));
}

function flattenChapters(nodes, depth = 0) {
  const result = [];
  for (const node of nodes ?? []) {
    result.push({...node, depth});
    result.push(...flattenChapters(node.chapters, depth + 1));
  }
  return result;
}

function buildSidebarItems(nodes) {
  return (nodes ?? []).map(node => {
    if (node.chapters?.length) {
      return {
        type: 'category',
        label: node.title,
        collapsed: false,
        items: buildSidebarItems(node.chapters),
      };
    }
    return {type: 'doc', id: node.id, label: node.title};
  });
}

function buildChapterList(nodes, slug, indent = '') {
  return (nodes ?? [])
    .map(node => {
      const line = `${indent}- [${node.title}](/books/${slug}/${node.id})`;
      const children = node.chapters?.length
        ? '\n' + buildChapterList(node.chapters, slug, indent + '  ')
        : '';
      return line + children;
    })
    .join('\n');
}

function rewriteAssetPaths(markdown) {
  return markdown
    .replace(/\]\(\.\.\/assets\//g, '](assets/')
    .replace(/\]\(@\/assets\//g, '](assets/');
}

// 技术书正文里经常出现 $SHELL、$PATH、$$ 等 shell 变量，remark-math 会误判为公式。
// 这里只保留独立成行的 $$ 公式块，其余正文中的 $ 一律转义为字面量。
function protectLiteralDollars(markdown) {
  const lines = markdown.split('\n');
  let inFence = false;
  let inMath = false;
  return lines
    .map(line => {
      const trimmed = line.trim();
      if (/^```/.test(trimmed)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      if (trimmed === '$$') {
        inMath = !inMath;
        return line;
      }
      if (inMath) return line;
      // 行内代码同样不应被转义（反斜杠在 code span 里会原样显示）。
      return line
        .split(/(`[^`]*`)/g)
        .map((segment, index) =>
          index % 2 === 1 ? segment : segment.replace(/\$/g, '\\$'),
        )
        .join('');
    })
    .join('\n');
}

function copyDirectory(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, {recursive: true});
  fs.cpSync(from, to, {recursive: true});
}

function safeSlug(slug, fallback) {
  const cleaned = String(slug ?? '')
    .trim()
    .replace(/[^A-Za-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || fallback;
}

function syncBook(entry, index) {
  const sourceDir = expandPath(entry.source);
  const metaPath = path.join(sourceDir, 'gfbook.yaml');
  if (!fs.existsSync(metaPath)) {
    warnings.push(`跳过 ${entry.slug}：未找到 ${metaPath}`);
    return null;
  }

  const meta = yaml.load(fs.readFileSync(metaPath, 'utf8')) ?? {};
  const slug = safeSlug(entry.slug, safeSlug(meta.title, `book-${index + 1}`));
  const title = entry.title || meta.title || slug;
  const bookDir = path.join(outputDir, slug);
  fs.mkdirSync(bookDir, {recursive: true});

  // 复制图片等资源；章节中的 assets/ 相对引用可直接工作。
  copyDirectory(path.join(sourceDir, 'assets'), path.join(bookDir, 'assets'));

  // 封面为可选字段；原型阶段没有真实封面时由前端绘制占位封面。
  let coverUrl = '';
  if (entry.cover) {
    const coverPath = expandPath(entry.cover);
    if (fs.existsSync(coverPath)) {
      fs.mkdirSync(staticCoverDir, {recursive: true});
      const ext = path.extname(coverPath) || '.png';
      const filename = `${slug}${ext}`;
      fs.copyFileSync(coverPath, path.join(staticCoverDir, filename));
      coverUrl = `/img/books/${filename}`;
    } else {
      warnings.push(`封面不存在：${coverPath}`);
    }
  }

  const chapters = flattenChapters(meta.chapters);
  const rendered = [];
  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const chapterPath = path.join(sourceDir, 'chapters', `${chapter.id}.md`);
    if (!fs.existsSync(chapterPath)) {
      warnings.push(`章节缺少正文：${title} / ${chapter.title}（${chapter.id}）`);
      continue;
    }
    const markdown = protectLiteralDollars(
      rewriteAssetPaths(fs.readFileSync(chapterPath, 'utf8').replace(/^\uFEFF/, '')),
    );
    const frontMatter = [
      '---',
      `title: ${yamlString(chapter.title)}`,
      `sidebar_label: ${yamlString(chapter.title)}`,
      `sidebar_position: ${i + 1}`,
      '---',
      '',
    ].join('\n');
    fs.writeFileSync(path.join(bookDir, `${chapter.id}.md`), frontMatter + markdown);
    rendered.push({...chapter, position: i + 1});
  }

  const sidebarConfig = {
    bookSidebar: [
      {
        type: 'category',
        label: title,
        link: {type: 'doc', id: 'index'},
        collapsed: false,
        items: buildSidebarItems(meta.chapters),
      },
    ],
  };
  fs.writeFileSync(
    path.join(bookDir, 'sidebar.js'),
    `module.exports = ${JSON.stringify(sidebarConfig, null, 2)};\n`,
  );

  const updatedAt = formatDate(meta.updated_time || entry.updatedAt);
  const intro = [
    '---',
    `title: ${yamlString(title)}`,
    'slug: /',
    'sidebar_label: "简介"',
    'sidebar_position: 0',
    '---',
    '',
    `# ${title}`,
    '',
    entry.description || '',
    '',
    `> ${[entry.author, entry.category, `${rendered.length} 章`, updatedAt ? `更新于 ${updatedAt}` : '']
      .filter(Boolean)
      .join(' · ')}`,
    '',
    '## 章节目录',
    '',
    buildChapterList(meta.chapters, slug),
    '',
  ].join('\n');
  fs.writeFileSync(path.join(bookDir, 'index.md'), intro);

  return {
    slug,
    title,
    description: entry.description || '',
    author: entry.author || '',
    category: entry.category || '',
    tags: entry.tags ?? [],
    cover: coverUrl,
    order: entry.order ?? index,
    createdAt: formatDate(meta.created_time),
    updatedAt,
    chapterCount: rendered.length,
    url: `/books/${slug}`,
  };
}

function main() {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  fs.rmSync(outputDir, {recursive: true, force: true});
  fs.mkdirSync(outputDir, {recursive: true});

  const books = [];
  for (const [index, entry] of (config.books ?? []).entries()) {
    if (entry.published === false) continue;
    try {
      const book = syncBook(entry, index);
      if (book) books.push(book);
    } catch (error) {
      warnings.push(`同步 ${entry.slug} 失败：${error.message}`);
    }
  }

  books.sort((a, b) => a.order - b.order);
  const manifest = {
    generatedAt: new Date().toISOString(),
    books,
  };
  fs.writeFileSync(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );

  console.log(`已同步 ${books.length} 本书到 books-data/`);
  books.forEach(book => console.log(`  - ${book.title} (${book.chapterCount} 章) ${book.url}`));
  if (warnings.length) {
    console.warn('\n警告：');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
}

main();
