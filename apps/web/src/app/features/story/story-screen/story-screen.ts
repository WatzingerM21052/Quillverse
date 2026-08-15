import { Component, signal } from '@angular/core';
import { Scene } from '../../../core/state/models/scene.model';

@Component({
  selector: 'qv-story-screen',
  imports: [],
  templateUrl: './story-screen.html',
  styleUrl: './story-screen.scss',
})
export class StoryScreen {
  /**
   * Placeholder scene so the layout is visible before the Context Builder / AI
   * Orchestrator (Phase 1 continuation) is wired up. Shape matches Scene exactly
   * so swapping this for a real AI response later requires no template changes.
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

  protected submitAction(): void {
    // Phase 2: send playerInput through the AI Orchestrator, await a
    // SimulationResponse, apply its statePatch, then clear the input.
    this.playerInput.set('');
  }
}
