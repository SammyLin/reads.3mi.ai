import { defineMiddleware } from 'astro:middleware';

// 舊網域 news.3mi.ai → reads.3mi.ai 301。
// /api/* 不轉,避免 ingest POST 在轉換期被 301 打斷(zone-level redirect rule 同樣排除)。
export const onRequest = defineMiddleware((context, next) => {
  const url = context.url;
  if (url.hostname === 'news.3mi.ai' && !url.pathname.startsWith('/api/')) {
    return context.redirect(`https://reads.3mi.ai${url.pathname}${url.search}`, 301);
  }
  return next();
});
