import { ReduxState } from '../reducers/index';
import { DrawParams, DrawPosition } from '../types/canvas';
import { getSelectedTool, getCurrentOpacity, getCurrentSize, getColor } from '../selectors/tools';

export const actionTypes = {
  setImageData: 'CANVAS//SET_IMAGE_DATA',
  startDrawing: 'CANVAS//START_DRAWING',
  stopDrawing: 'CANVAS//STOP_DRAWING',
  draw: 'CANVAS//DRAW',
  clear: 'CANVAS//CLEAR'
};

export interface RectParams {
  x: number;
  y: number;
  width: number;
  height: number;
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
    if (tool) {
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
    if (tool) {
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