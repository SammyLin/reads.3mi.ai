import rss from '@astrojs/rss';
import { listPublishedArticles, getDB } from '../lib/db';
import { withEdgeCache } from '../lib/edgeCache';
import type { APIContext } from 'astro';

export const prerender = false;

const AUTHORSHIP_LABEL: Record<string, string> = {
  original: '觀點',
  ai: 'AI 精選',
  translation: '譯文',
};

export async function GET(context: APIContext) {
  return withEdgeCache(context, () => buildFeed(context));
}

async function buildFeed(context: APIContext) {
  const authorshipParam = new URL(context.request.url).searchParams.get('authorship');
  const authorship = authorshipParam && authorshipParam in AUTHORSHIP_LABEL ? authorshipParam : undefined;

  let articles: any[] = [];
  try {
    const db = getDB(context);
    articles = await listPublishedArticles(db, { limit: 50, authorship });
  } catch (e: any) {
    console.error('RSS fetch failed:', e.message);
  }

  return rss({
    title: authorship ? `reads.3mi.ai — ${AUTHORSHIP_LABEL[authorship]}` : 'reads.3mi.ai',
    description: 'Sammy 的 AI 工程筆記',
    site: context.site || 'https://reads.3mi.ai',
    items: articles.map((article) => ({
      title: article.title,
      description: article.excerpt || '',
      pubDate: article.published_at ? new Date(article.published_at) : new Date(),
      link: `/post/${article.slug}`,
      categories: article.category ? [article.category.name] : [],
    })),
    customData: '<language>zh-TW</language>',
  });
}
