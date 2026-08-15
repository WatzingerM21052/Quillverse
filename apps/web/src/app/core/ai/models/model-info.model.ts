export interface ModelInfo {
  provider: string;
  id: string;
  displayName: string;
  capabilities: string[];
}

export type CredentialStatus =
  | 'not-configured'
  | 'connected'
  | 'needs-verification'
  | 'invalid-key'
  | 'revoked'
  | 'quota-exceeded'
  | 'temporarily-unavailable'
  | 'disabled';
