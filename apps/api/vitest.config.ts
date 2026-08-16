import path from 'node:path';
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-pool-workers';
import { defineConfig, defineProject } from 'vitest/config';

export default defineConfig(async () => {
  const migrations = await readD1Migrations(path.join(import.meta.dirname, 'migrations'));

  return defineProject({
    plugins: [
      cloudflareTest({
        // Deliberately not wrangler.jsonc: the `ai` binding has no local
        // emulator (Miniflare always proxies it to the real Cloudflare API),
        // which makes vitest-pool-workers demand a CLOUDFLARE_API_TOKEN even
        // in CI where no test touches it. This mirrors every other binding
        // but omits `ai` -- keep the two files in sync if D1/R2 ever change.
        wrangler: { configPath: './wrangler.test.jsonc' },
        miniflare: {
          bindings: { TEST_MIGRATIONS: migrations },
        },
      }),
    ],
    test: {
      setupFiles: ['./test/apply-migrations.ts'],
    },
  });
});
