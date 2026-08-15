import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, input, output, viewChild } from '@angular/core';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The one modal chrome for the whole app (character sheets, invitations,
 * letters, ...) so every overlay looks and behaves the same — Regency
 * border, backdrop click / ✕ to close, content projected in.
 *
 * §129 Accessibility: focus moves into the dialog on open and back to
 * whatever triggered it on close, Tab/Shift+Tab stay trapped inside while
 * open, Escape closes it — a screen reader or keyboard-only user otherwise
 * has no way to know an overlay opened at all.
 */
@Component({
  selector: 'qv-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal implements AfterViewInit, OnDestroy {
  readonly title = input<string>('');
  readonly closed = output<void>();

  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialogEl');
  private previouslyFocused: HTMLElement | null = null;

  ngAfterViewInit(): void {
    this.previouslyFocused = document.activeElement as HTMLElement | null;
    const dialogEl = this.dialog()?.nativeElement;
    const firstFocusable = dialogEl?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstFocusable ?? dialogEl)?.focus();
  }

  ngOnDestroy(): void {
    this.previouslyFocused?.focus();
  }

  @HostListener('keydown.escape')
  protected onEscape(): void {
    this.close();
  }

  /**
   * Deliberately a raw 'keydown' listener, not Angular's 'keydown.tab' alias —
   * that alias only matches Tab pressed with *no* modifiers, so Shift+Tab
   * (needed to trap focus going backward) would silently never fire it.
   * Found live: Shift+Tab escaped the dialog into the page behind it.
   */
  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const dialogEl = this.dialog()?.nativeElement;
    if (!dialogEl) return;

    const focusable = Array.from(dialogEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  protected close(): void {
    this.closed.emit();
  }
}
