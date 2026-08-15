import { Component, inject } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';

@Component({
  selector: 'qv-journal-screen',
  imports: [],
  templateUrl: './journal-screen.html',
  styleUrl: './journal-screen.scss',
})
export class JournalScreen {
  private readonly store = inject(SimulationStateStore);

  protected readonly chapters = this.store.chapters;
  protected readonly memories = this.store.journalMemories;
  protected readonly obligations = this.store.obligations;

  private static readonly ROMAN_NUMERALS: [number, string][] = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];

  protected toRoman(value: number): string {
    let remaining = value;
    let result = '';
    for (const [amount, numeral] of JournalScreen.ROMAN_NUMERALS) {
      while (remaining >= amount) {
        result += numeral;
        remaining -= amount;
      }
    }
    return result;
  }
}
