import { applyD1Migrations } from 'cloudflare:test';
import { env } from 'cloudflare:workers';

// Runs before every test file, outside per-file storage isolation.
// applyD1Migrations() only applies migrations that haven't run yet, so this
// is safe to re-run — it also carries the seed data from migrations
// 0002/0005/0006/0007, so `sim_default` exists exactly like in dev/prod.
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
