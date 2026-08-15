import { Component, computed, inject, signal } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { EntityId } from '../../../core/state/models/entity-id';
import { Character } from '../../../core/state/models/character.model';
import { Relationship } from '../../../core/state/models/relationship.model';
import { describeDimension } from '../../../core/state/relationship-language';
import { GmModeService } from '../../../core/gm/gm-mode.service';
import { API_BASE_URL } from '../../../core/config/api.config';

/** Seed data ships unused placeholder URIs (e.g. "asset://character/anne/base") — never render those as an <img src>. */
const PLACEHOLDER_SCHEME = 'asset://';

interface WebNode {
  character: Character;
  relationship: Relationship;
  /** Position on the web, in percent, so the player card sits at the centre (§34). */
  x: number;
  y: number;
}

@Component({
  selector: 'qv-relationships-screen',
  imports: [],
  templateUrl: './relationships-screen.html',
  styleUrl: './relationships-screen.scss',
})
export class RelationshipsScreen {
  private readonly store = inject(SimulationStateStore);
  protected readonly gmMode = inject(GmModeService);

  protected readonly describeDimension = describeDimension;
  protected readonly dimensionEntries = (dimensions: Relationship['dimensions']) => Object.entries(dimensions);
  protected readonly player = this.store.player;
  protected readonly selectedId = signal<EntityId | null>(null);

  protected readonly nodes = computed<WebNode[]>(() => {
    const player = this.store.player();
    const relationships = this.store.relationshipsOf(player.id);
    const radius = 38;

    return relationships.map((relationship, index) => {
      const angle = (index / relationships.length) * 2 * Math.PI - Math.PI / 2;
      return {
        character: this.store.characterById(relationship.to)(),
        relationship,
        x: 50 + radius * Math.cos(angle),
        y: 50 + radius * Math.sin(angle),
      };
    });
  });

  protected readonly selectedNode = computed(() => this.nodes().find((node) => node.character.id === this.selectedId()));

  protected select(id: EntityId): void {
    this.selectedId.set(id === this.selectedId() ? null : id);
  }

  protected portraitUrl(basePortrait: string): string | null {
    return basePortrait.startsWith(PLACEHOLDER_SCHEME) ? null : `${API_BASE_URL}${basePortrait}`;
  }
}
