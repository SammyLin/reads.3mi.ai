import type { APIRoute } from 'astro';
import { parse as parseFont, type Font } from 'opentype.js';
import { buildCoverSvg, buildCoverSvgPaths } from '../../lib/ogImage';

export const prerender = false;

// 每個 isolate 只抓/解析一次字型（Big5 常用字子集 WOFF）
let fontPromise: Promise<Font> | null = null;
function loadFont(requestUrl: string): Promise<Font> {
  if (!fontPromise) {
    fontPromise = fetch(new URL('/fonts/NotoSansTC-Bold-subset.woff', requestUrl))
      .then((res) => {
        if (!res.ok) throw new Error(`font fetch ${res.status}`);
        return res.arrayBuffer();
      })
      .then((buf) => parseFont(buf));
    fontPromise.catch(() => { fontPromise = null; });
  }
  return fontPromise;
}

/** 動態產生品牌封面 SVG。cover_image 沒真圖時用這個。 */
export const GET: APIRoute = async (context) => {
  const url = new URL(context.request.url);
  const title = url.searchParams.get('title') || 'news.3mi.ai';
  const color = url.searchParams.get('color') || '#ca8a04';
  const label = url.searchParams.get('label') || '';

  // 文字轉向量路徑：社群爬蟲（FB/LINE）沒有中文字型，<text> 會亂碼
  let svg: string;
  try {
    const font = await loadFont(context.request.url);
    svg = buildCoverSvgPaths(font, { title, color, label });
  } catch {
    svg = buildCoverSvg({ title, color, label });
  }

  return new Response(svg, {
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};
