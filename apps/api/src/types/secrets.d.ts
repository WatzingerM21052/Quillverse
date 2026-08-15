// wrangler types (worker-configuration.d.ts) only covers bindings declared in
// wrangler.jsonc. Secrets set via `wrangler secret put` / .dev.vars aren't
// config-visible, so they're declared here instead — merges into the same
// global Env interface.
interface Env {
  /** AES-GCM key encrypting stored provider API keys (addendum-v1.2-byok.md B9-B11). Never in D1, never in source. */
  CREDENTIAL_MASTER_KEY: string;
}
