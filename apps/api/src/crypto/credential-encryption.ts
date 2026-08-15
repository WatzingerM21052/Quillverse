// AES-GCM encryption for stored provider API keys (addendum-v1.2-byok.md B9-B13).
// CREDENTIAL_MASTER_KEY lives only as a Worker Secret — never in D1, never in source.

function base64ToBytes(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function importMasterKey(env: Env): Promise<CryptoKey> {
  const rawKey = base64ToBytes(env.CREDENTIAL_MASTER_KEY);
  return crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

export interface EncryptedCredential {
  ciphertext: string;
  iv: string;
  encryptionVersion: number;
}

export async function encryptCredential(env: Env, plaintext: string): Promise<EncryptedCredential> {
  const key = await importMasterKey(env);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipherBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext));

  return {
    ciphertext: bytesToBase64(new Uint8Array(cipherBuffer)),
    iv: bytesToBase64(iv),
    encryptionVersion: 1,
  };
}

export async function decryptCredential(env: Env, ciphertext: string, iv: string): Promise<string> {
  const key = await importMasterKey(env);
  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(iv) },
    key,
    base64ToBytes(ciphertext),
  );
  return new TextDecoder().decode(plainBuffer);
}

/** e.g. "••••7KQ2" — a hint the user recognizes, never the full key (B13). */
export function keyHint(apiKey: string): string {
  return `••••${apiKey.slice(-4)}`;
}
