// Cloudflare Pages Functions 的動態回應不會自動進 edge cache（cf-cache-status: DYNAMIC），
// 要手動走 Cache API。TTL 60 秒：ingest 新文章最多延遲 60 秒可見。
const CACHE_CONTROL = 'public, s-maxage=60, stale-while-revalidate=300';

/** 包住公開 GET handler：edge cache 命中直接回，未命中執行 handler 後寫入（僅 200）。 */
export async function withEdgeCache(context: any, handler: () => Promise<Response>): Promise<Response> {
  const cache = (globalThis as any).caches?.default;
  if (!cache) return handler();

  const key = context.request.url;
  const hit = await cache.match(key);
  if (hit) {
    const res = new Response(hit.body, hit);
    res.headers.set('x-edge-cache', 'hit');
    return res;
  }

  const res = await handler();
  if (res.status === 200) {
    res.headers.set('cache-control', CACHE_CONTROL);
    res.headers.set('x-edge-cache', 'miss');
    const put = cache.put(key, res.clone());
    const ctx = context?.locals?.runtime?.ctx;
    if (ctx?.waitUntil) ctx.waitUntil(put);
    else await put;
  }
  return res;
}
