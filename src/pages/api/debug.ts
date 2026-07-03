import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const info = {
    contextKeys: Object.keys(context),
    hasLocals: !!context.locals,
    localsKeys: context.locals ? Object.keys(context.locals) : [],
    hasRuntime: !!context.locals?.runtime,
    runtimeKeys: context.locals?.runtime ? Object.keys(context.locals.runtime) : [],
    hasEnv: !!context.env,
    envKeys: context.env ? Object.keys(context.env).join(', ') : 'none',
    hasCloudflare: !!context.cloudflare,
    cloudflareKeys: context.cloudflare ? Object.keys(context.cloudflare) : [],
    hasRuntimeEnv: !!context.locals?.runtime?.env,
    runtimeEnvKeys: context.locals?.runtime?.env ? Object.keys(context.locals.runtime.env).join(', ') : 'none',
    hasDB: !!context.locals?.runtime?.env?.DB,
    globalDB: !!(globalThis as any).DB,
  };

  return new Response(JSON.stringify(info, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
