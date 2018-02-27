import { ReduxState } from '../reducers/index';

export function getTransformMatrix(state: ReduxState) {
  return state.viewport.transformMatrix;
}

export function isDrawing(state: ReduxState) {
  return state.viewport.drawing;
}

export function getStoredGestureParams(state: ReduxState) {
  return state.viewport.storedGestureParams;
}

export function getStoredDrawParams(state: ReduxState) {
  return state.viewport.storedDrawParams;
}