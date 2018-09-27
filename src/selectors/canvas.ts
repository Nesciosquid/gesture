import { ReduxState } from '../reducers/index';
import { createSelector } from 'reselect';
import { combineLayers } from '../utils/canvas';

export const getCanvas = (state: ReduxState) => state.canvas;

export const getImageData = createSelector(getCanvas, (canvas) => {
  return canvas.flatImageData;
});

export const getDirtyBounds = createSelector(getCanvas, (canvas) => {
  return canvas.dirtyBounds;
});

export function getTransformMatrix(state: ReduxState) {
  return state.canvas.transformMatrix;
}