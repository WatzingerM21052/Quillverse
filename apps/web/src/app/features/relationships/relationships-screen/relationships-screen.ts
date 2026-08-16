import { Component, computed, inject, signal } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { EntityId } from '../../../core/state/models/entity-id';
import { Character } from '../../../core/state/models/character.model';
import { Relationship } from '../../../core/state/models/relationship.model';
import { describeDimension, describeMomentum, describeAttention } from '../../../core/state/relationship-language';
import { GmModeService } from '../../../core/gm/gm-mode.service';
import { API_BASE_URL } from '../../../core/config/api.config';

/** Seed data ships unused placeholder URIs (e.g. "asset://character/anne/base") — never render those as an <img src>. */
const PLACEHOLDER_SCHEME = 'asset://';

type FamilyBranch = 'paternal' | 'maternal' | 'root';

interface FamilyTreeLayoutEntry {
  generation: -1 | 0;
  branch: FamilyBranch;
  caption?: string;
}

/**
 * Explicit, hand-curated placement — not inferred from the relationship `type`
 * string, which alone can't tell a paternal uncle from a maternal one. Keyed by
 * character id so it stays correct as new family members are added, and keeps
 * this narrative fact (Thomas is the deceased father's brother, not Anne's) out
 * of the shared Relationship model, which the simulation engine also reads.
 */
const FAMILY_TREE_LAYOUT: Record<string, FamilyTreeLayoutEntry> = {
  char_anne_hale: { generation: -1, branch: 'maternal' },
  char_thomas_hale: { generation: -1, branch: 'paternal', caption: 'Bruder des Vaters' },
  char_grace_hale: { generation: 0, branch: 'root' },
};

interface RelationshipUnit {
  character: Character;
  relationship: Relationship;
}

interface FamilyUnit extends RelationshipUnit {
  layout: FamilyTreeLayoutEntry;
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
  protected readonly describeMomentum = describeMomentum;
  protected readonly describeAttention = describeAttention;
  protected readonly dimensionEntries = (dimensions: Relationship['dimensions']) => Object.entries(dimensions);
  protected readonly player = this.store.player;
  protected readonly selectedId = signal<EntityId | null>(null);
  protected readonly activeTab = signal<'family' | 'relationships'>('family');

  private readonly allUnits = computed<RelationshipUnit[]>(() => {
    const player = this.store.player();
    return this.store.relationshipsOf(player.id).map((relationship) => ({
      character: this.store.characterById(relationship.to)(),
      relationship,
    }));
  });

  protected readonly familyUnits = computed<FamilyUnit[]>(() =>
    this.allUnits()
      .filter((unit) => unit.character.id in FAMILY_TREE_LAYOUT)
      .map((unit) => ({ ...unit, layout: FAMILY_TREE_LAYOUT[unit.character.id] })),
  );

  protected readonly otherUnits = computed<RelationshipUnit[]>(() =>
    this.allUnits().filter((unit) => !(unit.character.id in FAMILY_TREE_LAYOUT)),
  );

  protected readonly motherUnit = computed(() =>
    this.familyUnits().find((unit) => unit.layout.generation === -1 && unit.layout.branch === 'maternal'),
  );

  protected readonly paternalUnits = computed(() =>
    this.familyUnits().filter((unit) => unit.layout.generation === -1 && unit.layout.branch === 'paternal'),
  );

  protected readonly siblingUnits = computed(() =>
    this.familyUnits().filter((unit) => unit.layout.generation === 0),
  );

  /** A mother on record implies a father existed, even if he has no character sheet of his own. */
  protected readonly showFatherPlaceholder = computed(() => !!this.motherUnit());

  protected readonly selectedFamilyUnit = computed(() => this.familyUnits().find((unit) => unit.character.id === this.selectedId()));
  protected readonly selectedOtherUnit = computed(() => this.otherUnits().find((unit) => unit.character.id === this.selectedId()));
  protected readonly selectedUnit = computed<RelationshipUnit | undefined>(
    () => this.selectedFamilyUnit() ?? this.selectedOtherUnit(),
  );

  protected select(id: EntityId): void {
    this.selectedId.set(id === this.selectedId() ? null : id);
  }

  protected selectTab(tab: 'family' | 'relationships'): void {
    this.activeTab.set(tab);
    this.selectedId.set(null);
  }

  protected portraitUrl(basePortrait: string): string | null {
    return basePortrait.startsWith(PLACEHOLDER_SCHEME) ? null : `${API_BASE_URL}${basePortrait}`;
  }
}
