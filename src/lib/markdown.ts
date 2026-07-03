// Markdown 渲染
// 注意：Cloudflare Workers 環境不支援 jsdom，因此移除了 DOMPurify sanitize
// 若需要 sanitize，考慮使用 isomorphic-dompurify 或其他方案

import { marked } from 'marked';
import hljs from 'highlight.js';

// 設定 marked
marked.setOptions({
  gfm: true,
  breaks: false,
});

// 客製：code block highlight
marked.use({
  renderer: {
    code(token: any) {
      const code = typeof token === 'string' ? token : token.text;
      const lang = typeof token === 'string' ? '' : (token.lang || '');
      let highlighted = code;
      if (lang && hljs.getLanguage(lang)) {
        try {
          highlighted = hljs.highlight(code, { language: lang }).value;
        } catch (e) {
          highlighted = code;
        }
      } else {
        try {
          highlighted = hljs.highlightAuto(code).value;
        } catch (e) {
          highlighted = code;
        }
      }
      return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
    },
  },
});

/** 渲染 Markdown → HTML（無 sanitize — 內容可控） */
export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

/** 從 Markdown 抽取 excerpt（取第一個段落或前 160 字） */
export function extractExcerpt(md: string, maxLen = 160): string {
  const plain = md
    .replace(/^#+ .+$/gm, '') // 移除標題
    .replace(/```[\s\S]*?```/g, '') // 移除 code block
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // links
    .replace(/[*_~>#-]+/g, '') // markdown 符號
    .replace(/\n+/g, ' ')
    .trim();

  return plain.length > maxLen ? plain.slice(0, maxLen) + '…' : plain;
}

/** 從 Markdown 標題抽取 slug */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\u4e00-\u9fff]+/g, (m) => encodeURIComponent(m)) // 中文保留
    .replace(/[^a-z0-9\u4e00-\u9fff\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}
