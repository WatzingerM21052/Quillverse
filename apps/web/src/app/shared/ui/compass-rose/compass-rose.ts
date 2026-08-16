import { Component, input } from '@angular/core';

/** Cartographic touch reserved for the Map screen (per design direction: occasional map-flavored ornament, not app-wide). */
@Component({
  selector: 'qv-compass-rose',
  standalone: true,
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 100 100" class="compass-rose" [attr.aria-hidden]="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke="var(--qv-gold)" stroke-width="1" opacity="0.6" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="var(--qv-gold)" stroke-width="0.5" opacity="0.4" />
      <g stroke="var(--qv-gold)" stroke-width="1" opacity="0.7">
        <path d="M50 4 L56 50 L50 96 L44 50 Z" />
        <path d="M4 50 L50 44 L96 50 L50 56 Z" />
      </g>
      <g stroke="var(--qv-gold)" stroke-width="0.5" opacity="0.45">
        <path d="M18 18 L50 50 L18 82" fill="none" />
        <path d="M82 18 L50 50 L82 82" fill="none" />
      </g>
      <circle cx="50" cy="50" r="3" fill="var(--qv-gold)" />
      <text x="50" y="16" text-anchor="middle" class="compass-rose__label">N</text>
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }

      .compass-rose__label {
        font-family: var(--qv-font-display);
        font-size: 8px;
        fill: var(--qv-gold);
      }
    `,
  ],
})
export class CompassRose {
  readonly size = input(72);
}
