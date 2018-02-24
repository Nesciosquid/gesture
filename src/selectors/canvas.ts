import { ReduxState } from '../reducers/index';

export function getImageData(state: ReduxState) {
  return state.canvas.imageData;
}