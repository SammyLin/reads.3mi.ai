import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
// import react from '@astrojs/react';  // ⚠️ 暫時關閉：沒用 React 但會把 React renderer 拉進 build，導致 /post/* SSR render 壞掉（[object Object]）
// import sitemap from '@astrojs/sitemap';  // ⚠️ 暫時關閉：build 時 routes 為空會炸（見 README）

export default defineConfig({
  site: 'https://news.3mi.ai',
  output: 'hybrid',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [
    // react(),  // 暫時關閉：news-3mi 沒用 React，但整合進來會 emit renderers.mjs 讓 worker 出怪問題
    // sitemap(),  // 暫時關閉：等 D1 有資料後再開（routes 為空時 plugin crash）
  ],
  vite: {
    ssr: {
      external: ['jsdom'],
    },
  },
});