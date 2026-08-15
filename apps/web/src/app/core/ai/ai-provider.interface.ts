import { ModelInfo, CredentialStatus } from './models/model-info.model';
import { SimulationRequest } from './models/simulation-request.model';
import { SimulationResponse } from './models/simulation-response.model';

/**
 * Implemented once per provider (Gemini, OpenAI, Anthropic, custom) — the
 * AI Orchestrator and simulation core only ever talk to this interface
 * (addendum-v1.2-byok.md B39-B42). No provider-specific detail may leak past it.
 */
export interface AiProvider {
  readonly providerId: string;
  validateCredential(): Promise<CredentialStatus>;
  listModels(): Promise<ModelInfo[]>;
  generateStory(request: SimulationRequest): Promise<SimulationResponse>;
}
