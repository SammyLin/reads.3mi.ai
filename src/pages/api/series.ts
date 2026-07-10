import type { APIRoute } from 'astro';
import { listSeries, getSeriesBySlug, getDB } from '../../lib/db';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  try {
    const db = getDB(context);
    const url = new URL(context.request.url);
    const slug = url.searchParams.get('slug');

    if (slug) {
      const data = await getSeriesBySlug(db, slug);
      if (!data) {
        return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
      }
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const series = await listSeries(db);
    return new Response(JSON.stringify({ series }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('series GET error:', e.message);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
