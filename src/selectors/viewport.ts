import { ReduxState } from '../reducers/index';

export function isDrawing(state: ReduxState) {
  return state.viewport.drawing;
}

export function getStoredGestureParams(state: ReduxState) {
  return state.viewport.storedGestureParams;
}

export function getStoredDrawParams(state: ReduxState) {
  return state.viewport.storedDrawParams;
}