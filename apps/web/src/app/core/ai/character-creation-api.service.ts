import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SimulationSummary } from '../state/savepoints-api.service';

export interface CharacterCreationAnswers {
  characterName?: string;
  age?: string;
  gender?: string;
  appearanceNotes?: string;
  personalityNotes?: string;
  strengthsWeaknesses?: string;
  education?: string;
  specialSkills?: string;
  backstory?: string;
  personalGoals?: string;
  family?: string;
  farmDetails?: string;
  tone?: ToneReferences;
}

export interface ToneReferences {
  romanceIntensity?: string;
  socialIntrigueDepth?: string;
  farmEconomyDepth?: string;
  historicalAccuracy?: string;
  narrativePace?: string;
}

export interface CharacterCreationDraft {
  schemaVersion: 1;
  player: {
    name: string;
    appearance: Record<string, string>;
    personalityTraits: string[];
    skills: Record<string, string>;
    goals: { shortTerm: string[]; midTerm: string[]; longTerm: string[]; currentWorries: string[] };
    backstory: string;
  };
  family: Array<{ name: string; relation: string; age: string; appearance: Record<string, string>; personalityTraits: string[] }>;
  farm: { landAcres: number; annualRent: string; livestock: string; supplies: string; workers: string };
  openingSummary: string;
}

/** §131 Character Creator — AI-assisted: player answers are optional, the AI fills gaps and returns a full draft to review before it's persisted. */
@Injectable({ providedIn: 'root' })
export class CharacterCreationApiService {
  private readonly http = inject(HttpClient);

  draft(answers: CharacterCreationAnswers): Observable<{ draft: CharacterCreationDraft; provider: string }> {
    return this.http.post<{ draft: CharacterCreationDraft; provider: string }>(
      `${API_BASE_URL}/api/character-creation/draft`,
      answers,
    );
  }

  confirm(draft: CharacterCreationDraft, label: string, tone: ToneReferences): Observable<SimulationSummary> {
    return this.http.post<SimulationSummary>(`${API_BASE_URL}/api/character-creation/confirm`, { draft, label, tone });
  }
}
