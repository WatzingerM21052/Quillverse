import { Component, input, output } from '@angular/core';

/**
 * The one modal chrome for the whole app (character sheets, invitations,
 * letters, ...) so every overlay looks and behaves the same — Regency
 * border, backdrop click / ✕ to close, content projected in.
 */
@Component({
  selector: 'qv-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  readonly title = input<string>('');
  readonly closed = output<void>();

  protected close(): void {
    this.closed.emit();
  }
}
