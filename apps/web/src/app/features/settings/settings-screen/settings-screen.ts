import { Component, computed, inject, signal } from '@angular/core';
import { Modal } from '../../../shared/ui/modal/modal';
import { AiProvidersApiService, ProviderStatus } from '../../../core/ai/ai-providers-api.service';

type SettingsSection = 'simulation' | 'appearance' | 'story' | 'ai' | 'backup' | 'privacy';

interface SettingsNavItem {
  id: SettingsSection;
  label: string;
}

const PROVIDER_DISPLAY_NAMES: Record<string, string> = {
  gemini: 'Google Gemini',
  openai: 'OpenAI',
  anthropic: 'Anthropic Claude',
};

/** Layout per addendum-v1.2-byok.md B76. Only "AI & Models" has real content so far. */
const SETTINGS_NAV: SettingsNavItem[] = [
  { id: 'simulation', label: 'Simulation' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'story', label: 'Story' },
  { id: 'ai', label: 'AI & Models' },
  { id: 'backup', label: 'Backup & Export' },
  { id: 'privacy', label: 'Privacy' },
];

const FALLBACK_ORDER = ['Gemini', 'OpenAI', 'Claude', 'Manual Relay'];

@Component({
  selector: 'qv-settings-screen',
  imports: [Modal],
  templateUrl: './settings-screen.html',
  styleUrl: './settings-screen.scss',
})
export class SettingsScreen {
  private readonly api = inject(AiProvidersApiService);

  protected readonly nav = SETTINGS_NAV;
  protected readonly activeSection = signal<SettingsSection>('ai');
  protected readonly fallbackOrder = FALLBACK_ORDER;
  protected readonly displayName = PROVIDER_DISPLAY_NAMES;

  protected readonly providers = signal<ProviderStatus[]>([
    { provider: 'gemini', connected: false, status: 'not-configured', keyHint: null, lastVerifiedAt: null },
    { provider: 'openai', connected: false, status: 'not-configured', keyHint: null, lastVerifiedAt: null },
    { provider: 'anthropic', connected: false, status: 'not-configured', keyHint: null, lastVerifiedAt: null },
  ]);
  protected readonly providersLoading = signal(true);

  protected readonly narratorLabel = computed(() => {
    const connected = this.providers().find((p) => p.connected);
    return connected ? PROVIDER_DISPLAY_NAMES[connected.provider] : 'Nicht verbunden — Manual Relay aktiv';
  });

  protected readonly connectingProviderId = signal<string | null>(null);
  protected readonly apiKeyDraft = signal('');
  protected readonly connectError = signal<string | null>(null);
  protected readonly connecting = signal(false);

  constructor() {
    this.api.list().subscribe({
      next: (list) => {
        this.providers.set(list);
        this.providersLoading.set(false);
      },
      error: () => this.providersLoading.set(false),
    });
  }

  protected selectSection(section: SettingsSection): void {
    this.activeSection.set(section);
  }

  protected startConnect(providerId: string): void {
    this.connectingProviderId.set(providerId);
    this.apiKeyDraft.set('');
    this.connectError.set(null);
  }

  protected closeConnect(): void {
    // §B6 — the entered value is discarded on close, never persisted or cached.
    this.connectingProviderId.set(null);
    this.apiKeyDraft.set('');
    this.connectError.set(null);
  }

  protected get connectingProvider(): ProviderStatus | undefined {
    return this.providers().find((provider) => provider.provider === this.connectingProviderId());
  }

  /** Test & Save (B7) — a real call. With no valid key on hand this will genuinely fail, which is the correct behavior. */
  protected testAndSave(): void {
    const providerId = this.connectingProviderId();
    const apiKey = this.apiKeyDraft().trim();
    if (!providerId || !apiKey) return;

    this.connecting.set(true);
    this.connectError.set(null);

    this.api.connect(providerId, apiKey).subscribe({
      next: (result) => {
        this.providers.update((list) =>
          list.map((p) => (p.provider === providerId ? { ...p, connected: true, status: 'connected', keyHint: result.keyHint } : p)),
        );
        this.connecting.set(false);
        this.closeConnect();
      },
      error: (err) => {
        this.connectError.set(err?.error?.error ?? 'The API key could not be authenticated.');
        this.connecting.set(false);
      },
    });
  }

  protected disconnect(providerId: string): void {
    this.api.disconnect(providerId).subscribe(() => {
      this.providers.update((list) =>
        list.map((p) => (p.provider === providerId ? { ...p, connected: false, status: 'not-configured', keyHint: null } : p)),
      );
    });
  }
}
