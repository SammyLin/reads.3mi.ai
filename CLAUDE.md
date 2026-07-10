# news.3mi.ai

Astro site on Cloudflare Pages + D1 + R2.

## UI convention

No emoji in UI. Use lucide icons (`lucide-astro` components for static markup; inline lucide SVG for runtime-built strings). Emoji only allowed inside article title / article content.

## Deploy

See [DEPLOY.md](./DEPLOY.md) — build then `wrangler pages deploy ./dist --project-name=news-3mi`. `wrangler login` required. `wrangler pages deploy` ships the working tree; `git stash -u` first if uncommitted WIP must not go live.
