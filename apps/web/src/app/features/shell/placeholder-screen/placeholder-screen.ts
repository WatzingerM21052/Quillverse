import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'qv-placeholder-screen',
  imports: [],
  templateUrl: './placeholder-screen.html',
  styleUrl: './placeholder-screen.scss',
})
export class PlaceholderScreen {
  private readonly route = inject(ActivatedRoute);

  protected readonly title = toSignal(
    this.route.data.pipe(map((data) => (data['title'] as string) ?? '')),
    { initialValue: '' },
  );

  protected readonly description = toSignal(
    this.route.data.pipe(map((data) => (data['description'] as string) ?? '')),
    { initialValue: '' },
  );
}
