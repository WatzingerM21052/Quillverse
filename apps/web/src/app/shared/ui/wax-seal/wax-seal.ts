import { Component, input } from '@angular/core';

/**
 * §4/§6 Ornamentik — the one signature decorative element for this pass
 * (§166 issue): a wax letter-seal, used sparingly at moments that are
 * genuinely about correspondence/permanence (chapter markers, savepoints,
 * bookmarked memories) rather than sprinkled everywhere. "Inhalt vor
 * Dekoration" — this stays small and quiet, never a full-bleed graphic.
 */
@Component({
  selector: 'qv-wax-seal',
  standalone: true,
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 48 48" class="wax-seal" [attr.aria-hidden]="true">
      <circle cx="24" cy="24" r="22" fill="url(#wax-seal-gradient)" stroke="var(--qv-gold)" stroke-width="1.25" />
      <circle
        cx="24"
        cy="24"
        r="18"
        fill="none"
        stroke="var(--qv-gold)"
        stroke-width="0.5"
        stroke-dasharray="1.5 3"
        opacity="0.6"
      />
      <text x="24" y="31" text-anchor="middle" class="wax-seal__glyph">Q</text>
      <defs>
        <radialGradient id="wax-seal-gradient" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stop-color="#8a3a42" />
          <stop offset="100%" stop-color="#5a2129" />
        </radialGradient>
      </defs>
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }

      .wax-seal__glyph {
        font-family: var(--qv-font-display);
        font-size: 22px;
        font-style: italic;
        fill: var(--qv-gold);
      }
    `,
  ],
})
export class WaxSeal {
  readonly size = input(40);
}
