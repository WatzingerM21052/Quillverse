import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { simulationsRoute } from './routes/simulations';
import { aiProvidersRoute } from './routes/ai-providers';
import { turnsRoute } from './routes/turns';
import { savepointsRoute } from './routes/savepoints';

const ALLOWED_ORIGINS = ['https://watzingerm21052.github.io', 'http://localhost:4200'];

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors({ origin: ALLOWED_ORIGINS }));

app.get('/', (c) => c.json({ name: 'quillverse-api', status: 'ok' }));

app.route('/api/simulations', simulationsRoute);
app.route('/api/simulations', turnsRoute);
app.route('/api/simulations', savepointsRoute);
app.route('/api/ai/providers', aiProvidersRoute);

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal server error.' }, 500);
});

export default app;
