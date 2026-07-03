import rss from '@astrojs/rss';
import { listPublishedArticles, getDB } from '../lib/db';
import type { APIContext } from 'astro';

export const prerender = false;

export async function GET(context: APIContext) {
  let articles: any[] = [];
  try {
    const db = getDB(context);
    articles = await listPublishedArticles(db, { limit: 50 });
  } catch (e: any) {
    console.error('RSS fetch failed:', e.message);
  }

  return rss({
    title: 'news.3mi.ai',
    description: 'Sammy 的 AI 工程筆記',
    site: context.site || 'https://news.3mi.ai',
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
