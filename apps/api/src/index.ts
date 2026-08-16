import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { simulationsRoute } from './routes/simulations';
import { aiProvidersRoute } from './routes/ai-providers';
import { turnsRoute } from './routes/turns';
import { savepointsRoute } from './routes/savepoints';
import { gmRoute } from './routes/gm';
import { assetsRoute } from './routes/assets';
import { charactersRoute } from './routes/characters';
import { characterCreationRoute } from './routes/character-creation';
import { backupRoute } from './routes/backup';
import { journalRoute } from './routes/journal';
import { locationsRoute } from './routes/locations';

const ALLOWED_ORIGINS = ['https://watzingerm21052.github.io', 'http://localhost:4200'];

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors({ origin: ALLOWED_ORIGINS }));

app.get('/', (c) => c.json({ name: 'quillverse-api', status: 'ok' }));

app.route('/api/simulations', simulationsRoute);
app.route('/api/simulations', turnsRoute);
app.route('/api/simulations', savepointsRoute);
app.route('/api/simulations', gmRoute);
app.route('/api/simulations', charactersRoute);
app.route('/api/simulations', backupRoute);
app.route('/api/simulations', journalRoute);
app.route('/api/simulations', locationsRoute);
app.route('/api/ai/providers', aiProvidersRoute);
app.route('/api/assets', assetsRoute);
app.route('/api/character-creation', characterCreationRoute);

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal server error.' }, 500);
});

export default app;
