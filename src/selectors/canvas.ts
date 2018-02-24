import { ReduxState } from '../reducers/index';

export function getImageData(state: ReduxState) {
  return state.canvas.imageData;
}

export function getTransformMatrix(state: ReduxState) {
  return state.canvas.transformMatrix;
}

export function isDrawing(state: ReduxState) {
  return state.canvas.drawing;
}