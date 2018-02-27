import { ReduxState } from '../reducers/index';
import { createSelector } from 'reselect';
import { combineLayers } from '../utils/canvas';

export const getCanvas = (state: ReduxState) => state.canvas;

export const getImageData = createSelector(getCanvas, (canvas) => {
  return canvas.flatImageData;
});