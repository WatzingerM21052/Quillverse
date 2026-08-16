import { Injectable, signal } from '@angular/core';

export type Language = 'de' | 'en';

const STORAGE_KEY = 'qv-language';

function readStored(): Language {
  return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'de';
}

/**
 * German is the app's default and the only language most screens are
 * written in — this is deliberately not a full translation-key catalogue.
 * `t()` takes the German text and its English counterpart inline at the call
 * site, so any component can opt into the toggle for a given string without
 * a central dictionary file. Currently wired into the main navigation and
 * the Settings screen; extending coverage to other screens means adding
 * `t()` calls there, not changing this service.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly language = signal<Language>(readStored());

  setLanguage(language: Language): void {
    this.language.set(language);
    localStorage.setItem(STORAGE_KEY, language);
  }

  t(de: string, en: string): string {
    return this.language() === 'en' ? en : de;
  }
}
