import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
// import sitemap from '@astrojs/sitemap';  // ⚠️ 暫時關閉：build 時 routes 為空會炸（見 README）

export default defineConfig({
  site: 'https://news.3mi.ai',
  output: 'hybrid',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [
    react(),
    // sitemap(),  // 暫時關閉：等 D1 有資料後再開（routes 為空時 plugin crash）
  ],
  vite: {
    ssr: {
      external: ['jsdom'],
    },
  },
});