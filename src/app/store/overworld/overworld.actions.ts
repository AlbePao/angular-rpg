import { createActionGroup, emptyProps } from '@ngrx/store';

export const OverworldActions = createActionGroup({
  source: 'Overworld',
  events: {
    Init: emptyProps(),
  },
});
