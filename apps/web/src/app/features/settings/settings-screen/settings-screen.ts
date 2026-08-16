import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Modal } from '../../../shared/ui/modal/modal';
import { AiProvidersApiService, ProviderStatus, ModelInfo } from '../../../core/ai/ai-providers-api.service';
import { GmModeService } from '../../../core/gm/gm-mode.service';
import { SavepointsApiService, SavepointSummary, SimulationSummary } from '../../../core/state/savepoints-api.service';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { ActiveSimulationService } from '../../../core/state/active-simulation.service';
import { BackupApiService } from '../../../core/state/backup-api.service';
import { buildBackupZip, backupFilename, parseBackupZip } from '../../../core/state/backup-zip.util';
import { TonePreferencesApiService } from '../../../core/state/tone-preferences-api.service';
import { TonePreferences } from '../../../core/state/models/simulation-state.model';
import { LanguageService } from '../../../core/i18n/language.service';

type SettingsSection = 'simulation' | 'appearance' | 'story' | 'ai' | 'gm' | 'backup' | 'privacy' | 'language';

interface SettingsNavItem {
  id: SettingsSection;
  label: string;
}

interface ToneAxis {
  key: keyof TonePreferences;
  label: string;
  lowLabel: string;
  highLabel: string;
  /** 5 levels, index 0 = lowest. Index 2 ("ausgeglichen") is also the default when nothing is stored yet. */
  levels: string[];
}

/** §174 SIMULATION SETTINGS — 5 sliders, narrative/simulation weighting only, never success odds (§175). */
const TONE_AXES: ToneAxis[] = [
  {
    key: 'romanceIntensity',
    label: 'Romantik',
    lowLabel: 'Gering',
    highLabel: 'Hoch',
    levels: ['sehr gering', 'eher gering', 'ausgeglichen', 'eher hoch', 'sehr hoch'],
  },
  {
    key: 'socialIntrigueDepth',
    label: 'Gesellschaft',
    lowLabel: 'Gering',
    highLabel: 'Hoch',
    levels: ['sehr gering', 'eher gering', 'ausgeglichen', 'eher hoch', 'sehr hoch'],
  },
  {
    key: 'farmEconomyDepth',
    label: 'Hofverwaltung',
    lowLabel: 'Knapp',
    highLabel: 'Ausführlich',
    levels: ['sehr oberflächlich', 'eher oberflächlich', 'ausgeglichen', 'eher detailliert', 'sehr detailliert'],
  },
  {
    key: 'historicalAccuracy',
    label: 'Historische Genauigkeit',
    lowLabel: 'Locker',
    highLabel: 'Streng',
    levels: ['sehr locker', 'eher locker', 'ausgeglichen', 'eher strikt', 'sehr strikt'],
  },
  {
    key: 'narrativePace',
    label: 'Erzähltempo',
    lowLabel: 'Langsam',
    highLabel: 'Schnell',
    levels: ['sehr langsam', 'eher langsam', 'ausgeglichen', 'eher schnell', 'sehr schnell'],
  },
];

const PROVIDER_DISPLAY_NAMES: Record<string, string> = {
  gemini: 'Google Gemini',
  openai: 'OpenAI',
  anthropic: 'Anthropic Claude',
};

/** Layout per addendum-v1.2-byok.md B76. Only "AI & Models" has real content so far. */
const SETTINGS_NAV: SettingsNavItem[] = [
  { id: 'simulation', label: 'Simulation' },
  { id: 'appearance', label: 'Erscheinungsbild' },
  { id: 'story', label: 'Geschichte' },
  { id: 'ai', label: 'KI & Modelle' },
  { id: 'gm', label: 'GM / Debug' },
  { id: 'backup', label: 'Sicherung & Export' },
  { id: 'language', label: 'Sprache' },
  { id: 'privacy', label: 'Datenschutz' },
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
  private readonly backupApi = inject(BackupApiService);
  private readonly toneApi = inject(TonePreferencesApiService);
  private readonly store = inject(SimulationStateStore);
  protected readonly activeSimulation = inject(ActiveSimulationService);
  protected readonly gmMode = inject(GmModeService);
  protected readonly lang = inject(LanguageService);

  protected readonly nav = SETTINGS_NAV;
  protected readonly activeSection = signal<SettingsSection>('ai');
  protected readonly fallbackOrder = FALLBACK_ORDER;
  protected readonly displayName = PROVIDER_DISPLAY_NAMES;

  protected readonly toneAxes = TONE_AXES;
  protected readonly tonePreferences = this.store.tonePreferences;

  /** 1-5, defaulting to the middle ("ausgeglichen") when nothing is stored or the stored text doesn't match a known level (e.g. from an older free-text answer). */
  protected toneLevel(axis: ToneAxis): number {
    const stored = this.tonePreferences()[axis.key];
    const index = stored ? axis.levels.indexOf(stored) : -1;
    return (index === -1 ? 2 : index) + 1;
  }

  protected setToneLevel(axis: ToneAxis, value: number): void {
    const label = axis.levels[value - 1];
    if (!label) return;

    const next: TonePreferences = { ...this.tonePreferences(), [axis.key]: label };
    this.toneApi.update(next).subscribe({
      next: ({ state }) => this.store.refresh(state),
    });
  }

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

  /** B25-28 Model Discovery / Selector UI — per-provider, loaded lazily so a connected-but-unopened provider doesn't fire an extra request. */
  protected readonly models = signal<Record<string, ModelInfo[]>>({});
  protected readonly selectedModels = signal<Record<string, string | null>>({});
  protected readonly modelsLoading = signal<Record<string, boolean>>({});

  /** §106 Continuity Guard — null provider means the feature is off (default). */
  protected readonly continuityProvider = signal<string | null>(null);
  protected readonly continuityModelId = signal<string | null>(null);

  /**
   * Guards against two independent races: (1) getContinuityModel() resolving before list(), which
   * would otherwise try to select an <option> that doesn't exist in the DOM yet; (2) the
   * configured provider later being disconnected, in which case its <option> disappears from the
   * list. Both cases fall back to "" (shows "Aus") until the provider is actually present and
   * connected.
   */
  protected readonly continuitySelectValue = computed(() => {
    const provider = this.continuityProvider();
    if (!provider) return '';
    const isConnected = this.providers().some((p) => p.provider === provider && p.connected);
    return isConnected ? provider : '';
  });

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
        for (const p of list) {
          if (p.connected) this.loadModels(p.provider);
        }
      },
      error: () => this.providersLoading.set(false),
    });

    this.api.getContinuityModel().subscribe({
      next: ({ provider, modelId }) => {
        this.continuityProvider.set(provider);
        this.continuityModelId.set(modelId);
        if (provider) this.loadModels(provider);
      },
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
        this.loadModels(providerId);
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
      this.models.update((m) => ({ ...m, [providerId]: [] }));
    });
  }

  /** B25-28 — fetched once per provider (on connect, or on first expand for an already-connected provider). */
  protected loadModels(providerId: string): void {
    if (this.models()[providerId]?.length || this.modelsLoading()[providerId]) return;

    this.modelsLoading.update((m) => ({ ...m, [providerId]: true }));
    this.api.listModels(providerId).subscribe({
      next: ({ models, selectedModel }) => {
        this.models.update((m) => ({ ...m, [providerId]: models }));
        this.selectedModels.update((m) => ({ ...m, [providerId]: selectedModel }));
        this.modelsLoading.update((m) => ({ ...m, [providerId]: false }));
      },
      error: () => this.modelsLoading.update((m) => ({ ...m, [providerId]: false })),
    });
  }

  protected selectModel(providerId: string, modelId: string): void {
    const value = modelId || null;
    this.selectedModels.update((m) => ({ ...m, [providerId]: value }));
    this.api.setModel(providerId, value).subscribe();
  }

  protected setContinuityProvider(provider: string): void {
    const value = provider || null;
    this.continuityProvider.set(value);
    this.continuityModelId.set(null);
    if (value) this.loadModels(value);
    this.api.setContinuityModel(value, null).subscribe();
  }

  protected setContinuityModelId(modelId: string): void {
    const value = modelId || null;
    this.continuityModelId.set(value);
    this.api.setContinuityModel(this.continuityProvider(), value).subscribe();
  }

  protected readonly exporting = signal(false);
  protected readonly exportError = signal<string | null>(null);

  /** §A34-A41 Compact Save — assembled server-side, zipped client-side, downloaded directly (no server-side zip storage). */
  protected exportCompactSave(): void {
    this.exporting.set(true);
    this.exportError.set(null);

    this.backupApi.exportData().subscribe({
      next: (data) => {
        const zip = buildBackupZip(data);
        // zip.buffer could be larger than zip itself if it's a view into a pooled
        // ArrayBuffer -- slice the exact byte range so the Blob doesn't include
        // stray bytes, and get a plain ArrayBuffer to satisfy BlobPart's stricter type.
        const exactBytes = zip.buffer.slice(zip.byteOffset, zip.byteOffset + zip.byteLength) as ArrayBuffer;
        const blob = new Blob([exactBytes], { type: 'application/zip' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = backupFilename(data.manifest.simulationName, data.manifest.worldDate);
        link.click();
        URL.revokeObjectURL(url);
        this.exporting.set(false);
      },
      error: (err) => {
        this.exportError.set(err?.error?.error ?? 'Export fehlgeschlagen.');
        this.exporting.set(false);
      },
    });
  }

  protected readonly importPreview = signal<{ manifest: unknown; simulation: unknown; label: string } | null>(null);
  protected readonly importing = signal(false);
  protected readonly importError = signal<string | null>(null);

  /** §A42 step 1-5 (read manifest -> check version -> validate JSON -> preview) — the actual import/persist only happens on confirmImport(). */
  protected async onImportFileSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.importError.set(null);
    this.importPreview.set(null);

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { manifest, simulation } = parseBackupZip(bytes);
      const label = (manifest as { simulationName?: string }).simulationName ?? 'Imported Timeline';
      this.importPreview.set({ manifest, simulation, label: `${label} (Import)` });
    } catch (err) {
      this.importError.set(err instanceof Error ? err.message : 'ZIP-Datei konnte nicht gelesen werden.');
    }
  }

  protected setImportLabel(label: string): void {
    this.importPreview.update((preview) => (preview ? { ...preview, label } : preview));
  }

  protected cancelImport(): void {
    this.importPreview.set(null);
    this.importError.set(null);
  }

  /** §A43 — always a new timeline, the active save is never touched. */
  protected confirmImport(): void {
    const preview = this.importPreview();
    if (!preview) return;

    this.importing.set(true);
    this.importError.set(null);

    this.backupApi.import(preview.manifest as never, preview.simulation as never, preview.label).subscribe({
      next: () => {
        this.importing.set(false);
        this.importPreview.set(null);
        this.refreshTimelines();
      },
      error: (err) => {
        this.importError.set(err?.error?.error ?? 'Import fehlgeschlagen.');
        this.importing.set(false);
      },
    });
  }
}
