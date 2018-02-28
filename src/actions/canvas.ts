import { ReduxState } from '../reducers/index';
import { DrawParams, DrawPosition } from '../types/canvas';
import { getSelectedTool, getCurrentOpacity, getCurrentSize, getColor } from '../selectors/tools';
import { TransformMatrix } from '../utils/transform';
import { startLog } from '../actions/performance';

export const actionTypes = {
  setImageData: 'CANVAS//SET_IMAGE_DATA',
  draw: 'CANVAS//DRAW',
  clear: 'CANVAS//CLEAR',
};

export function setImageData(imageData: ImageData, layer: number) {
  return ({
      type: actionTypes.setImageData,
      payload: {
        imageData,
        layer
      }
  });
}

export function __draw(params: DrawParams, lastParams: DrawParams, layer: number) {
  return ({
    type: actionTypes.draw,
    payload: {
      params,
      lastParams,
      layer
    }
  });
}

export function draw(params: DrawParams, lastParams: DrawParams, layer: number) {
  return (dispatch: Function, getState: () => ReduxState) => {
    dispatch(startLog());
    dispatch(__draw(params, lastParams, layer));
  };
}

export function clear(layer: number) {
  return ({
    type: actionTypes.clear,
    payload: layer
  });
}