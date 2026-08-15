import { Hono } from 'hono';

/** Serves generated images (portraits, ...) stored in R2 under env.ASSETS. */
export const assetsRoute = new Hono<{ Bindings: Env }>();

assetsRoute.get('/*', async (c) => {
  const key = c.req.path.replace(/^\/api\/assets\//, '');
  const object = await c.env.ASSETS.get(key);
  if (!object) {
    return c.json({ error: 'Asset not found.' }, 404);
  }

  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
});
