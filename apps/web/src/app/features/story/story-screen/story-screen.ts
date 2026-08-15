import { Component, inject, signal } from '@angular/core';
import { Scene } from '../../../core/state/models/scene.model';
import { ManualRelayService } from '../../../core/ai/manual-relay.service';
import { DirectTurnApiService } from '../../../core/ai/direct-turn-api.service';
import { AiProvidersApiService } from '../../../core/ai/ai-providers-api.service';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { Modal } from '../../../shared/ui/modal/modal';

/** Same priority as Settings' FALLBACK_ORDER — first connected provider wins, else Manual Relay. */
const PROVIDER_PRIORITY = ['gemini', 'openai', 'anthropic'];

interface ProviderLink {
  name: string;
  url: string;
}

const PROVIDER_LINKS: ProviderLink[] = [
  { name: 'ChatGPT öffnen', url: 'https://chat.openai.com/' },
  { name: 'Claude öffnen', url: 'https://claude.ai/new' },
  { name: 'Gemini öffnen', url: 'https://gemini.google.com/app' },
];

@Component({
  selector: 'qv-story-screen',
  imports: [Modal],
  templateUrl: './story-screen.html',
  styleUrl: './story-screen.scss',
})
export class StoryScreen {
  private readonly relay = inject(ManualRelayService);
  private readonly directTurn = inject(DirectTurnApiService);
  private readonly providersApi = inject(AiProvidersApiService);
  private readonly store = inject(SimulationStateStore);

  protected readonly providerLinks = PROVIDER_LINKS;

  /** null until the provider list loads; a provider id once one is connected, so submitAction can skip Manual Relay. */
  protected readonly connectedProvider = signal<string | null>(null);
  protected readonly generating = signal(false);
  protected readonly generateError = signal<string | null>(null);
  protected readonly undoing = signal(false);
  protected readonly undoMessage = signal<string | null>(null);

  constructor() {
    this.providersApi.list().subscribe({
      next: (list) => {
        const connected = PROVIDER_PRIORITY.find((id) => list.some((p) => p.provider === id && p.connected));
        this.connectedProvider.set(connected ?? null);
      },
      error: () => this.connectedProvider.set(null),
    });
  }

  /**
   * Starting scene until the first turn commits. Shape matches Scene exactly
   * so swapping it for a real committed scene requires no template changes.
   */
  protected readonly scene = signal<Scene>({
    locationId: 'loc_player_farm',
    worldDate: '12. April 1813',
    time: 'Morgen',
    weather: 'leichter Nebel',
    narration: [
      'Der Nebel liegt noch über den Feldern, als du zur Scheune gehst. Irgendwo in der Ferne hörst du bereits die Hähne.',
    ],
    dialogue: [],
  });

  protected readonly playerInput = signal('');

  protected readonly relayOpen = signal(false);
  protected readonly relayLoading = signal(false);
  protected readonly relayError = signal<string | null>(null);
  protected readonly contextText = signal('');
  protected readonly baseStateVersion = signal(0);
  protected readonly responseDraft = signal('');
  protected readonly copyConfirmed = signal(false);

  private pendingPlayerAction = '';

  /** Phase 2/6: skip Manual Relay entirely when a BYOK provider is connected. */
  protected submitAction(): void {
    const action = this.playerInput().trim();
    if (!action) return;

    const provider = this.connectedProvider();
    if (provider) {
      this.generateDirect(action, provider);
      return;
    }

    this.startManualRelay(action);
  }

  private generateDirect(action: string, provider: string): void {
    this.generating.set(true);
    this.generateError.set(null);

    this.directTurn.generate(action, provider).subscribe({
      next: ({ state, scene }) => {
        this.store.refresh(state);
        this.scene.set(scene);
        this.playerInput.set('');
        this.generating.set(false);
      },
      error: (err) => {
        this.generateError.set(err?.error?.error ?? `${provider} konnte den Zug nicht erzeugen.`);
        this.generating.set(false);
      },
    });
  }

  /** Step 1 of Manual Relay (A24): build the context package as soon as the player commits to an action. */
  private startManualRelay(action: string): void {
    this.pendingPlayerAction = action;
    this.relayError.set(null);
    this.copyConfirmed.set(false);
    this.responseDraft.set('');
    this.relayOpen.set(true);
    this.relayLoading.set(true);

    this.relay.generateContextPackage(action).subscribe({
      next: (pkg) => {
        this.contextText.set(pkg.contextText);
        this.baseStateVersion.set(pkg.baseStateVersion);
        this.relayLoading.set(false);
      },
      error: () => {
        this.relayError.set('Konnte kein Context Package erzeugen — ist der Server erreichbar?');
        this.relayLoading.set(false);
      },
    });
  }

  protected async copyContext(): Promise<void> {
    await navigator.clipboard.writeText(this.contextText());
    this.copyConfirmed.set(true);
  }

  /** Step 5 (A24): validate + commit what the player pasted back. */
  protected submitResponse(): void {
    const text = this.responseDraft().trim();
    if (!text) return;

    this.relayError.set(null);
    this.relayLoading.set(true);

    this.relay.commitTurn(this.pendingPlayerAction, this.baseStateVersion(), text).subscribe({
      next: ({ state, scene }) => {
        this.store.refresh(state);
        this.scene.set(scene);
        this.playerInput.set('');
        this.relayOpen.set(false);
        this.relayLoading.set(false);
      },
      error: (err) => {
        this.relayError.set(err?.error?.error ?? 'Antwort konnte nicht übernommen werden.');
        this.relayLoading.set(false);
      },
    });
  }

  protected closeRelay(): void {
    this.relayOpen.set(false);
  }

  /**
   * §153 Undo Last Turn. Restores the pre-turn world state; the displayed
   * narration text itself isn't part of that snapshot, so it stays on
   * screen until the next action — the undo message makes that explicit
   * rather than silently leaving stale narration unexplained.
   */
  protected undoLastTurn(): void {
    this.undoing.set(true);
    this.undoMessage.set(null);

    this.directTurn.undoLastTurn().subscribe({
      next: ({ state }) => {
        this.store.refresh(state);
        this.undoMessage.set('Letzter Zug rückgängig gemacht.');
        this.undoing.set(false);
      },
      error: (err) => {
        this.undoMessage.set(err?.error?.error ?? 'Nichts zum Rückgängigmachen.');
        this.undoing.set(false);
      },
    });
  }
}
