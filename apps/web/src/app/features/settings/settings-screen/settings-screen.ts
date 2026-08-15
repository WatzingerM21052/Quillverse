import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Modal } from '../../../shared/ui/modal/modal';
import { AiProvidersApiService, ProviderStatus } from '../../../core/ai/ai-providers-api.service';
import { GmModeService } from '../../../core/gm/gm-mode.service';
import { SavepointsApiService, SavepointSummary, SimulationSummary } from '../../../core/state/savepoints-api.service';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { ActiveSimulationService } from '../../../core/state/active-simulation.service';

type SettingsSection = 'simulation' | 'appearance' | 'story' | 'ai' | 'gm' | 'backup' | 'privacy';

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
  { id: 'gm', label: 'GM / Debug' },
  { id: 'backup', label: 'Backup & Export' },
  { id: 'privacy', label: 'Privacy' },
];

const FALLBACK_ORDER = ['Gemini', 'OpenAI', 'Claude', 'Manual Relay'];

@Component({
  selector: 'qv-settings-screen',
  imports: [Modal, RouterLink],
  templateUrl: './settings-screen.html',
  styleUrl: './settings-screen.scss',
})
export class SettingsScreen {
  private readonly api = inject(AiProvidersApiService);
  private readonly savepointsApi = inject(SavepointsApiService);
  private readonly store = inject(SimulationStateStore);
  protected readonly activeSimulation = inject(ActiveSimulationService);
  protected readonly gmMode = inject(GmModeService);

  protected readonly nav = SETTINGS_NAV;
  protected readonly activeSection = signal<SettingsSection>('ai');
  protected readonly fallbackOrder = FALLBACK_ORDER;
  protected readonly displayName = PROVIDER_DISPLAY_NAMES;

  protected readonly providers = signal<ProviderStatus[]>([
    { provider: 'gemini', connected: false, status: 'not-configured', keyHint: null, lastVerifiedAt: null, requestsToday: 0 },
    { provider: 'openai', connected: false, status: 'not-configured', keyHint: null, lastVerifiedAt: null, requestsToday: 0 },
    { provider: 'anthropic', connected: false, status: 'not-configured', keyHint: null, lastVerifiedAt: null, requestsToday: 0 },
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

  protected readonly savepoints = signal<SavepointSummary[]>([]);
  protected readonly savepointsLoading = signal(true);
  protected readonly newSavepointLabel = signal('');
  protected readonly savepointBusy = signal(false);
  protected readonly savepointError = signal<string | null>(null);

  protected readonly timelines = signal<SimulationSummary[]>([]);
  protected readonly timelinesLoading = signal(true);

  /** §155 Timeline Tree — flattened depth-first (root, its children, their children, ...) so a plain list can render it indented. */
  protected readonly timelineTree = computed(() => {
    const all = this.timelines();
    const byParent = new Map<string | null, SimulationSummary[]>();
    for (const timeline of all) {
      const key = timeline.parentSimulationId;
      const siblings = byParent.get(key) ?? [];
      siblings.push(timeline);
      byParent.set(key, siblings);
    }

    const flattened: Array<{ timeline: SimulationSummary; depth: number }> = [];
    const visit = (parentId: string | null, depth: number) => {
      for (const timeline of byParent.get(parentId) ?? []) {
        flattened.push({ timeline, depth });
        visit(timeline.id, depth + 1);
      }
    };
    visit(null, 0);

    return flattened;
  });
  protected readonly forkingSavepointId = signal<string | null>(null);
  protected readonly forkLabelDraft = signal('');
  protected readonly forkBusy = signal(false);
  protected readonly forkError = signal<string | null>(null);

  constructor() {
    this.api.list().subscribe({
      next: (list) => {
        this.providers.set(list);
        this.providersLoading.set(false);
      },
      error: () => this.providersLoading.set(false),
    });

    this.refreshSavepoints();
    this.refreshTimelines();
  }

  private refreshSavepoints(): void {
    this.savepointsLoading.set(true);
    this.savepointsApi.list().subscribe({
      next: (list) => {
        this.savepoints.set(list);
        this.savepointsLoading.set(false);
      },
      error: () => this.savepointsLoading.set(false),
    });
  }

  private refreshTimelines(): void {
    this.timelinesLoading.set(true);
    this.savepointsApi.listTimelines().subscribe({
      next: (list) => {
        this.timelines.set(list);
        this.timelinesLoading.set(false);
      },
      error: () => this.timelinesLoading.set(false),
    });
  }

  /** §123 Save Selection — switch which timeline every screen reads/writes. */
  protected switchTimeline(id: string): void {
    this.activeSimulation.setActive(id);
  }

  protected startFork(savepointId: string): void {
    this.forkingSavepointId.set(savepointId);
    this.forkLabelDraft.set('');
    this.forkError.set(null);
  }

  protected cancelFork(): void {
    this.forkingSavepointId.set(null);
    this.forkLabelDraft.set('');
    this.forkError.set(null);
  }

  /** §154 Branching Timelines — the source timeline is left untouched. */
  protected confirmFork(): void {
    const savepointId = this.forkingSavepointId();
    const label = this.forkLabelDraft().trim();
    if (!savepointId || !label) return;

    this.forkBusy.set(true);
    this.forkError.set(null);

    this.savepointsApi.fork(savepointId, label).subscribe({
      next: () => {
        this.forkBusy.set(false);
        this.cancelFork();
        this.refreshTimelines();
      },
      error: (err) => {
        this.forkError.set(err?.error?.error ?? 'Alternate Timeline konnte nicht erstellt werden.');
        this.forkBusy.set(false);
      },
    });
  }

  protected createSavepoint(): void {
    const label = this.newSavepointLabel().trim();
    if (!label) return;

    this.savepointBusy.set(true);
    this.savepointError.set(null);

    this.savepointsApi.create(label).subscribe({
      next: () => {
        this.newSavepointLabel.set('');
        this.savepointBusy.set(false);
        this.refreshSavepoints();
      },
      error: (err) => {
        this.savepointError.set(err?.error?.error ?? 'Save Point konnte nicht erstellt werden.');
        this.savepointBusy.set(false);
      },
    });
  }

  protected restoreSavepoint(id: string): void {
    this.savepointBusy.set(true);
    this.savepointError.set(null);

    this.savepointsApi.restore(id).subscribe({
      next: ({ state }) => {
        this.store.refresh(state);
        this.savepointBusy.set(false);
      },
      error: (err) => {
        this.savepointError.set(err?.error?.error ?? 'Save Point konnte nicht wiederhergestellt werden.');
        this.savepointBusy.set(false);
      },
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
