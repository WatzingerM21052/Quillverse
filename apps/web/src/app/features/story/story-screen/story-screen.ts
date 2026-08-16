import { Component, computed, inject, signal } from '@angular/core';
import { Scene, DialogueLine } from '../../../core/state/models/scene.model';
import { ManualRelayService } from '../../../core/ai/manual-relay.service';
import { DirectTurnApiService } from '../../../core/ai/direct-turn-api.service';
import { AiProvidersApiService } from '../../../core/ai/ai-providers-api.service';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { JournalApiService } from '../../../core/state/journal-api.service';
import { PendingStoryActionService } from '../../../core/state/pending-story-action.service';
import { Modal } from '../../../shared/ui/modal/modal';
import { WaxSeal } from '../../../shared/ui/wax-seal/wax-seal';
import { API_BASE_URL } from '../../../core/config/api.config';
import { FocusModeService } from '../../../core/ui/focus-mode.service';

const PLACEHOLDER_SCHEME = 'asset://';

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
  imports: [Modal, WaxSeal],
  templateUrl: './story-screen.html',
  styleUrl: './story-screen.scss',
})
export class StoryScreen {
  private readonly relay = inject(ManualRelayService);
  private readonly directTurn = inject(DirectTurnApiService);
  private readonly providersApi = inject(AiProvidersApiService);
  private readonly store = inject(SimulationStateStore);
  private readonly journalApi = inject(JournalApiService);
  private readonly pendingAction = inject(PendingStoryActionService);
  protected readonly focusMode = inject(FocusModeService);

  protected readonly providerLinks = PROVIDER_LINKS;
  protected readonly recap = this.store.recap;
  protected readonly recapDismissed = signal(false);

  protected readonly bookmarkBusy = signal(false);
  protected readonly bookmarkMessage = signal<string | null>(null);
  protected readonly favoritedQuoteText = signal<string | null>(null);

  /** §19 (issue) Scene Background — the current location's generated image, when one exists. */
  protected readonly sceneBackgroundUrl = computed(() => {
    const baseAsset = this.store.current().locations[this.scene().locationId]?.baseAsset;
    if (!baseAsset || baseAsset.startsWith(PLACEHOLDER_SCHEME)) return null;
    return `${API_BASE_URL}${baseAsset}`;
  });

  /** §9/§14 — dialogue lines carried a raw speakerId with no portrait; both were simply never wired to this screen. */
  protected speakerName(speakerId: string): string {
    if (speakerId === this.store.player().id) return this.store.player().name;
    return this.store.current().characters[speakerId]?.name ?? speakerId;
  }

  protected locationName(locationId: string): string {
    return this.store.current().locations[locationId]?.name ?? locationId;
  }

  private characterPortraitUrl(characterId: string): string | null {
    const basePortrait = this.store.current().characters[characterId]?.visualState.basePortrait;
    if (!basePortrait || basePortrait.startsWith(PLACEHOLDER_SCHEME)) return null;
    return `${API_BASE_URL}${basePortrait}`;
  }

  /** First non-player speaker in the scene, honoring an explicit `position` if the AI set one. */
  protected readonly leftSpeakerPortrait = computed(() => this.speakerPortraitFor('left', 0));
  protected readonly rightSpeakerPortrait = computed(() => this.speakerPortraitFor('right', 1));

  private speakerPortraitFor(side: 'left' | 'right', fallbackIndex: number): string | null {
    const playerId = this.store.player().id;
    const explicit = this.scene().dialogue.find((line) => line.speakerId !== playerId && line.position === side);
    if (explicit) return this.characterPortraitUrl(explicit.speakerId);

    const distinctSpeakers = [...new Set(this.scene().dialogue.map((line) => line.speakerId))].filter((id) => id !== playerId);
    const speakerId = distinctSpeakers[fallbackIndex];
    return speakerId ? this.characterPortraitUrl(speakerId) : null;
  }

  /** null until the provider list loads; a provider id once one is connected, so submitAction can skip Manual Relay. */
  protected readonly connectedProvider = signal<string | null>(null);
  /** B50 Manual Narrator switch — every connected provider, for the dropdown; empty until the list loads. */
  protected readonly connectedProviders = signal<string[]>([]);
  /** The player's chosen narrator for the next turn; defaults to connectedProvider once it loads, resets each session (not persisted). */
  protected readonly selectedProvider = signal<string | null>(null);
  protected readonly generating = signal(false);
  protected readonly generateError = signal<string | null>(null);
  /** §98 Provider Change Indicator — whichever provider actually narrated the last turn (A32 fallback may differ from connectedProvider). */
  protected readonly lastUsedProvider = signal<string | null>(null);
  /** §106 Continuity Guard — true only for the turn just committed, not sticky across turns. */
  protected readonly continuityRetried = signal(false);
  protected readonly undoing = signal(false);
  protected readonly undoMessage = signal<string | null>(null);

  constructor() {
    this.providersApi.list().subscribe({
      next: (list) => {
        const connectedIds = PROVIDER_PRIORITY.filter((id) => list.some((p) => p.provider === id && p.connected));
        this.connectedProviders.set(connectedIds);
        const connected = connectedIds[0] ?? null;
        this.connectedProvider.set(connected);
        this.selectedProvider.set(connected);
      },
      error: () => this.connectedProvider.set(null),
    });

    const pending = this.pendingAction.consume();
    if (pending) this.playerInput.set(pending);
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

    if (this.connectedProvider()) {
      this.generateDirect(action);
      return;
    }

    this.startManualRelay(action);
  }

  /** A32 automatic fallback lives server-side (tries every connected provider); if all of them fail, fall through to Manual Relay here rather than a dead-end error. */
  private generateDirect(action: string): void {
    this.generating.set(true);
    this.generateError.set(null);

    this.directTurn.generate(action, this.selectedProvider() ?? undefined).subscribe({
      next: ({ state, scene, provider, continuityRetried }) => {
        this.store.refresh(state);
        this.scene.set(scene);
        this.playerInput.set('');
        this.lastUsedProvider.set(provider);
        this.continuityRetried.set(continuityRetried);
        this.generating.set(false);
      },
      error: (err) => {
        this.generating.set(false);
        if (err?.error?.allProvidersFailed) {
          this.generateError.set('Alle verbundenen KI-Anbieter waren nicht erreichbar — wechsle zu Manual Relay.');
          this.startManualRelay(action);
          return;
        }
        this.generateError.set(err?.error?.error ?? 'Der Zug konnte nicht erzeugt werden.');
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

  protected dismissRecap(): void {
    this.recapDismissed.set(true);
  }

  /** §195 BOOKMARK MOMENT — "Remember this moment" on the currently displayed scene. */
  protected bookmarkMoment(): void {
    const scene = this.scene();
    const text = scene.dialogue.length > 0 ? scene.dialogue.map((line) => line.text).join(' ') : scene.narration.join(' ');
    if (!text.trim()) return;

    this.bookmarkBusy.set(true);
    this.bookmarkMessage.set(null);
    this.journalApi.bookmark(text).subscribe({
      next: ({ state }) => {
        this.store.refresh(state);
        this.bookmarkMessage.set('Als wichtige Erinnerung im Journal gemerkt.');
        this.bookmarkBusy.set(false);
      },
      error: () => {
        this.bookmarkMessage.set('Moment konnte nicht gemerkt werden.');
        this.bookmarkBusy.set(false);
      },
    });
  }

  /** §196 FAVORITE QUOTES. */
  protected favoriteQuote(line: DialogueLine): void {
    this.journalApi.favoriteQuote(line.text, line.speakerId, this.scene().locationId).subscribe({
      next: ({ state }) => {
        this.store.refresh(state);
        this.favoritedQuoteText.set(line.text);
      },
    });
  }
}
