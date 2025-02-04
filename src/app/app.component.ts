import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameContainerComponent } from '@lib/components/game-container/game-container.component';

@Component({
  selector: 'app-root',
  imports: [GameContainerComponent],
  template: `<app-game-container></app-game-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
