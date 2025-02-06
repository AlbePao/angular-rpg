import { inject, Injectable } from '@angular/core';
import { WINDOW } from '@lib/tokens/window';
import { expand, filter, map, Observable, of, share } from 'rxjs';

interface FrameData {
  frameStartTime: number;
  deltaTime: number;
}

const clampTo30FPS = (frame: FrameData | null) => {
  if (!frame) {
    return frame;
  }

  if (frame.deltaTime > 1 / 30) {
    frame.deltaTime = 1 / 30;
  }
  return frame;
};

@Injectable({
  providedIn: 'root',
})
export class GameLoop {
  private readonly _window = inject(WINDOW);

  private _calculateStep(prevFrame: FrameData | null): Observable<FrameData | null> {
    return new Observable<FrameData | null>((observer) => {
      this._window.requestAnimationFrame((frameStartTime) => {
        // Millis to seconds
        const deltaTime = prevFrame ? (frameStartTime - prevFrame.frameStartTime) / 1000 : 0;
        observer.next({
          frameStartTime,
          deltaTime,
        });
      });
    }).pipe(map((frame) => clampTo30FPS(frame)));
  }

  getCurrentFrame() {
    return of(null).pipe(
      expand((val) => this._calculateStep(val)),
      // Expand emits the first value provided to it, and in this
      // case we just want to ignore the null input frame
      filter((frame) => frame !== null),
      map((frame: FrameData) => frame.deltaTime),
      share(),
    );
  }
}
