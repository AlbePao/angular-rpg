import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { OVERWORLD_MAPS } from '@lib/constants/overworld-maps';
import { GameCanvas } from '@lib/services/game-canvas.service';
import { GameContainer } from '@lib/services/game-container.service';
import { GameLoop } from '@lib/services/game-loop.service';
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
export class GameContainerComponent implements OnInit {
  private readonly _gameContainer = inject(GameContainer);
  private readonly _gameCanvas = inject(GameCanvas);
  private readonly _gameLoop = inject(GameLoop);
  private readonly _store = inject(Store);

  gameContainer = viewChild<ElementRef<HTMLDivElement>>('gameContainer');
  gameCanvas = viewChild<ElementRef<HTMLCanvasElement>>('gameCanvas');

  ngOnInit(): void {
    this._gameContainer.setGameContainer(this.gameContainer()?.nativeElement);
    this._gameCanvas.setGameCanvas(this.gameCanvas()?.nativeElement);

    this._gameLoop.getCurrentFrame().subscribe(() => {
      this._store.dispatch(OverworldMapActions.drawObjects());
    });

    // Start the game
    this._store.dispatch(
      OverworldMapActions.init({ maps: OVERWORLD_MAPS, currentMapId: 'DemoRoom', cameraPersonId: 'hero' }),
    );
  }
}
