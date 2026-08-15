import { EntityId } from './entity-id';

export interface DialogueLine {
  speakerId: EntityId;
  text: string;
  expression?: string;
  position?: 'left' | 'right';
}

export interface Scene {
  locationId: EntityId;
  worldDate: string;
  time: string;
  weather: string;
  narration: string[];
  dialogue: DialogueLine[];
  imageCue?: Record<string, unknown>;
}
