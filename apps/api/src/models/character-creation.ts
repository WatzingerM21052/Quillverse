/** Raw, mostly-optional player answers to the §131 questionnaire — the AI fills any gaps. */
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
  tone?: {
    romanceIntensity?: string;
    socialIntrigueDepth?: string;
    farmEconomyDepth?: string;
    historicalAccuracy?: string;
    narrativePace?: string;
  };
}

export interface DraftFamilyMember {
  name: string;
  relation: string;
  age: string;
  appearance: Record<string, string>;
  personalityTraits: string[];
}

export interface CharacterCreationDraft {
  schemaVersion: 1;
  player: {
    name: string;
    appearance: Record<string, string>;
    personalityTraits: string[];
    skills: Record<string, string>;
    goals: {
      shortTerm: string[];
      midTerm: string[];
      longTerm: string[];
      currentWorries: string[];
    };
    backstory: string;
  };
  family: DraftFamilyMember[];
  farm: {
    landAcres: number;
    annualRent: string;
    livestock: string;
    supplies: string;
    workers: string;
  };
  openingSummary: string;
}
