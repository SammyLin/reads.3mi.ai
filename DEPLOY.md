# Deploy — news.3mi.ai

Cloudflare Pages project: **news-3mi**
Production domain: **https://news.3mi.ai**

## Prerequisite

```bash
npx wrangler login   # interactive; run once
```

## Build + deploy

```bash
cd news.3mi.ai
ASTRO_TELEMETRY_DISABLED=1 npm run build
npx wrangler pages deploy ./dist --project-name=news-3mi
```

> `wrangler pages deploy ./dist` ships **whatever is in the working tree** at build time.
> If uncommitted WIP must NOT go live, `git stash -u` before build and `git stash pop` after.

## D1 migrations

If the deploy includes a new D1 migration, run it against remote **before** relying on it:

```bash
npx wrangler d1 execute news-3mi-db --remote --file=migrations/<migration>.sql
```

## Verify

```bash
curl -f https://news.3mi.ai/
curl -f https://news.3mi.ai/api/ingest
```
