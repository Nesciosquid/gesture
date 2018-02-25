import { ReduxState } from '../reducers/index';
import { DrawParams, DrawPosition } from '../types/canvas';
import { getSelectedTool, getCurrentOpacity, getCurrentSize, getColor } from '../selectors/tools';
import { TransformMatrix } from '../utils/transform';
import { isDrawing } from '../selectors/canvas';

export const actionTypes = {
  setImageData: 'CANVAS//SET_IMAGE_DATA',
  startDrawing: 'CANVAS//START_DRAWING',
  stopDrawing: 'CANVAS//STOP_DRAWING',
  draw: 'CANVAS//DRAW',
  clear: 'CANVAS//CLEAR',
  setTransform: 'CANVAS//SET_TRANSFORM',
  storeTransform: 'CANVAS//STORE_TRANSFORM',
  clearStoredTransform: 'CANVAS//CLEAR_STORED_TRANSFORM'
};

export function clearStoredTransform() {
  return ({
    type: actionTypes.clearStoredTransform,
  });
}

export function storeTransform(matrix: TransformMatrix) {
  return ({
    type: actionTypes.storeTransform,
    payload: matrix
  });
}

export function setTransformMatrix(matrix: TransformMatrix) {
  return ({
    type: actionTypes.setTransform,
    payload: matrix
  });
}

export function setImageData(imageData: ImageData) {
  return ({
      type: actionTypes.setImageData,
      payload: imageData
  });
}

export function draw(params: DrawParams) {
  return ({
    type: actionTypes.draw,
    payload: params
  });
}

export function __startDrawing(params: DrawParams) {
  return ({
    type: actionTypes.startDrawing,
    payload: params
  });
}

export function startDrawing(position: DrawPosition) {
  return (dispatch: Function, getState: () => ReduxState) => {
    const state = getState();
    const tool = getSelectedTool(state);
    const notDrawing = !isDrawing(state);
    if (tool && notDrawing) {
      const opacity = getCurrentOpacity(state, tool);
      const size = getCurrentSize(state, tool);
      const color = getColor(state);
      dispatch(__startDrawing({
        position,
        tool,
        size,
        opacity,
        color
      }));
    }
  };
}

export function stopDrawing() {
  return ({
    type: actionTypes.stopDrawing
  });
}

export function clear() {
  return ({
    type: actionTypes.clear
  });
}

export function drawWithCurrentTool(position: DrawPosition) {
  return (dispatch: Function, getState: () => ReduxState) => {
    const state = getState();
    const tool = getSelectedTool(state);
    const drawing = isDrawing(state);
    if (tool && drawing) {
      const opacity = getCurrentOpacity(state, tool);
      const size = getCurrentSize(state, tool);
      const color = getColor(state);
      dispatch(draw({
        position,
        tool,
        size,
        opacity,
        color
      }));
    }
  };
}