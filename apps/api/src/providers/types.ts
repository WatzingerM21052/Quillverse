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
}
