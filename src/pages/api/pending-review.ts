import type { APIRoute } from 'astro';
import { getDB } from '../../lib/db';

export const prerender = false;

const SITE_URL = 'https://reads.3mi.ai';

const getEnv = (context: any) => context.locals.runtime?.env || context.locals.cloudflare?.env || context.locals.env || {};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

function authorized(request: Request, expected: string | undefined) {
  if (!expected) return false;
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : request.headers.get('x-openclaw-key') || '';
  return token.length === expected.length && token === expected;
}

/** OpenClaw pre-flight check: how many drafts still await human review. */
export const GET: APIRoute = async (context) => {
  const env = getEnv(context);
  if (!authorized(context.request, env.OPENCLAW_NEWS_INGEST_KEY || env.OPENCLAW_INGEST_KEY)) return json({ error: 'Unauthorized' }, 401);

  const db = getDB(context);
  const result = await db.prepare(`
    SELECT id, slug, title, created_at, updated_at
    FROM articles WHERE status='draft' ORDER BY updated_at DESC LIMIT 50
  `).all();
  const drafts = (result.results || []) as Array<{ id: number; slug: string; title: string; created_at: string; updated_at: string }>;

  return json({
    pending_count: drafts.length,
    admin_url: `${SITE_URL}/admin/`,
    articles: drafts.map((a) => ({
      id: a.id,
      title: a.title,
      updated_at: a.updated_at,
      preview_url: `${SITE_URL}/admin/preview/${a.id}`,
      edit_url: `${SITE_URL}/admin/edit/${a.id}`,
    })),
  });
};
