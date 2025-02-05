import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { OVERWORLD_MAPS } from '@lib/constants/overworld-maps';
import { GameContainer } from '@lib/services/game-container.service';
import { Store } from '@ngrx/store';
import { OverworldMapActions } from '@store/overworld-map/overworld-map.actions';

@Component({
  selector: 'app-game-container',
  imports: [],
  template: `
    <div #gameContainer class="game-container">
      <canvas #gameCanvas class="game-canvas" width="352" height="198"></canvas>
    </div>
  `,
  styleUrl: './game-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameContainerComponent implements OnInit, AfterViewInit {
  private readonly _gameContainer = inject(GameContainer);
  private readonly _store = inject(Store);

  gameContainer = viewChild<ElementRef<HTMLDivElement>>('gameContainer');
  gameCanvas = viewChild<ElementRef<HTMLCanvasElement>>('gameCanvas');

  ngOnInit(): void {
    this._gameContainer.getCurrentFrame().subscribe(() => {
      this._store.dispatch(OverworldMapActions.drawObjects());
    });

    // Start the game
    this._store.dispatch(
      OverworldMapActions.init({ maps: OVERWORLD_MAPS, currentMapId: 'Kitchen', cameraPersonId: 'hero' }),
    );
  }

  ngAfterViewInit(): void {
    const gameContainer = this.gameContainer()?.nativeElement;
    const gameCanvas = this.gameCanvas()?.nativeElement;
    this._gameContainer.init({ gameContainer, gameCanvas });
  }
}
