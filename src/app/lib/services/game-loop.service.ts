import { inject, Injectable } from '@angular/core';
import { WINDOW } from '@lib/tokens/window';
import { expand, filter, interval, Observable, of, share, throttle } from 'rxjs';

interface FrameData {
  frameStartTime: number;
  deltaTime: number;
}

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
    });
  }

  getCurrentFrame() {
    return of(null).pipe(
      expand((val) => this._calculateStep(val)),
      // Expand emits the first value provided to it, and in this
      // case we just want to ignore the null input frame
      filter((frame): frame is FrameData => frame !== null),
      // Limit emission to 60 fps (1000ms / 60fps = 16.66, rounded to 10)
      throttle(() => interval(10)),
      share(),
    );
  }
}
