import { Component, signal } from '@angular/core';
import { Modal } from '../../../shared/ui/modal/modal';

type SettingsSection = 'simulation' | 'appearance' | 'story' | 'ai' | 'backup' | 'privacy';

interface SettingsNavItem {
  id: SettingsSection;
  label: string;
}

type ProviderConnectionStatus = 'not-connected' | 'connected';

interface ProviderDisplay {
  id: string;
  name: string;
  status: ProviderConnectionStatus;
  model: string | null;
}

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
  protected readonly nav = SETTINGS_NAV;
  protected readonly activeSection = signal<SettingsSection>('ai');
  protected readonly fallbackOrder = FALLBACK_ORDER;

  protected readonly providers = signal<ProviderDisplay[]>([
    { id: 'gemini', name: 'Google Gemini', status: 'not-connected', model: null },
    { id: 'openai', name: 'OpenAI', status: 'not-connected', model: null },
    { id: 'anthropic', name: 'Anthropic Claude', status: 'not-connected', model: null },
  ]);

  protected readonly connectingProviderId = signal<string | null>(null);
  protected readonly apiKeyDraft = signal('');

  protected selectSection(section: SettingsSection): void {
    this.activeSection.set(section);
  }

  protected startConnect(providerId: string): void {
    this.connectingProviderId.set(providerId);
    this.apiKeyDraft.set('');
  }

  protected closeConnect(): void {
    // §B6 — the entered value is discarded on close, never persisted or cached.
    this.connectingProviderId.set(null);
    this.apiKeyDraft.set('');
  }

  protected get connectingProvider(): ProviderDisplay | undefined {
    return this.providers().find((provider) => provider.id === this.connectingProviderId());
  }
}
