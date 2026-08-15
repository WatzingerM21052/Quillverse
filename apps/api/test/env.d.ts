// Test-only binding injected via vitest.config.ts (miniflare.bindings) — not
// a real Worker binding, so it isn't in the generated worker-configuration.d.ts.
declare namespace Cloudflare {
  interface Env {
    TEST_MIGRATIONS: import('cloudflare:test').D1Migration[];
  }
}
