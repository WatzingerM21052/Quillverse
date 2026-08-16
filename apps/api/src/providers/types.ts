export type ProviderId = 'gemini' | 'openai' | 'anthropic';

export const PROVIDER_IDS: ProviderId[] = ['gemini', 'openai', 'anthropic'];

export interface ModelInfo {
  provider: ProviderId;
  id: string;
  displayName: string;
}

export interface ValidationResult {
  ok: boolean;
  message?: string;
}

/**
 * One implementation per provider (addendum-v1.2-byok.md B39-B42). The
 * credential route only ever calls this interface — provider-specific auth
 * headers and response shapes stay inside each adapter.
 */
export interface AiProviderAdapter {
  readonly providerId: ProviderId;
  validateCredential(apiKey: string): Promise<ValidationResult>;
  listModels(apiKey: string): Promise<ModelInfo[]>;
  /**
   * Direct-API turn generation (ui-master-prompt-v1.md Phase 2/6). Returns
   * the model's raw text response — expected to be handed to
   * validateManualTurnResponse() same as a Manual Relay paste, just sourced
   * from an API call instead of a human copy-paste.
   *
   * `modelId` (B25-28 Model Discovery / Selector UI) — the user's saved
   * choice from `listModels()`. Optional: when absent, the adapter falls
   * back to its own live-discovery heuristic, same as before this existed.
   */
  generateStory(apiKey: string, contextText: string, modelId?: string): Promise<string>;
}
