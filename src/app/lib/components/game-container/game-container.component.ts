import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { GameContainer } from '@lib/services/game-container.service';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { OverworldActions } from '@store/overworld/overworld.actions';
import { selectOverworldIsInitialized } from '@store/overworld/overworld.selectors';
import { expand, filter, map, Observable, of, share } from 'rxjs';

export interface IFrameData {
  frameStartTime: number;
  deltaTime: number;
}

const clampTo30FPS = (frame?: IFrameData) => {
  if (!frame) {
    return frame;
  }

  if (frame.deltaTime > 1 / 30) {
    frame.deltaTime = 1 / 30;
  }
  return frame;
};

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

  calculateStep: (prevFrame?: IFrameData) => Observable<IFrameData | undefined> = (
    prevFrame: IFrameData | undefined,
  ) => {
    return new Observable<IFrameData | undefined>((observer) => {
      requestAnimationFrame((frameStartTime) => {
        // Millis to seconds
        const deltaTime = prevFrame ? (frameStartTime - prevFrame.frameStartTime) / 1000 : 0;
        observer.next({
          frameStartTime,
          deltaTime,
        });
      });
    }).pipe(map((frame) => clampTo30FPS(frame)));
  };

  frames$ = of(undefined).pipe(
    expand((val) => this.calculateStep(val)),
    // Expand emits the first value provided to it, and in this
    //  case we just want to ignore the undefined input frame
    filter((frame) => frame !== undefined),
    map((frame: IFrameData) => frame.deltaTime),
    share(),
  );

  ngOnInit(): void {
    this.frames$
      .pipe(concatLatestFrom(() => this._store.select(selectOverworldIsInitialized)))
      .subscribe(([gameState, isInitialized]) => {
        console.log('dispatch draw action', gameState);
        if (isInitialized) {
          this._store.dispatch(OverworldActions.drawObjects());
        }
      });
  }

  ngAfterViewInit(): void {
    const gameContainer = this.gameContainer()?.nativeElement;
    const gameCanvas = this.gameCanvas()?.nativeElement;

    if (!gameContainer || !gameCanvas) {
      throw new Error('Game container or game canvas not found');
    }

    this._gameContainer.init({ gameContainer, gameCanvas });
  }
}
