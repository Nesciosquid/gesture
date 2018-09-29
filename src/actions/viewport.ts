import { ReduxState } from '../reducers/index';
import { DrawParams, DrawPosition } from '../types/canvas';
import { getSelectedTool, getCurrentOpacity, getCurrentSize, getColor, getCurrentLayer } from '../selectors/tools';
import { TransformMatrix } from '../utils/transform';
import { isDrawing, getStoredDrawParams } from '../selectors/viewport';
import { GestureParams } from '../reducers/viewport';
import { draw } from './canvas';
import { startSampling, stopSampling, addSample } from './performance';

export const actionTypes = {
  startDrawing: 'VIEWPORT//START_DRAWING',
  stopDrawing: 'VIEWPORT//STOP_DRAWING',
  storeGestureParams: 'VIEWPORT//STORE_GESTURE_PARAMS',
  clearGestureParams: 'VIEWPORT//CLEAR_GESTURE_PARAMS',
  storeDrawParams: 'VIEWPORT//STORE_DRAW_PARAMS',
  clearDrawParams: 'VIEWPORT//CLEAR_DRAW_PARAMS'
};

export function clearStoredDrawParams() {
  return ({
    type: actionTypes.clearDrawParams
  });
}

export function storeDrawParams(params: DrawParams) {
  return ({
    type: actionTypes.storeDrawParams,
    payload: params
  });
}

export function clearStoredGestureParams() {
  return ({
    type: actionTypes.clearGestureParams
  });
}

export function storeGestureParams(params: GestureParams) {
  return ({
    type: actionTypes.storeGestureParams,
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
      const drawParams = {
        position,
        tool,
        size,
        opacity,
        color
      };
      dispatch(storeDrawParams(drawParams));
      dispatch(startSampling());
      dispatch(__startDrawing(drawParams));
    }
  };
}

export function __stopDrawing() {
  return ({
    type: actionTypes.stopDrawing
  });
}

export function stopDrawing() {
  return (dispatch: Function, getState: () => ReduxState) => {
    dispatch(clearStoredDrawParams());
    dispatch(__stopDrawing());
    dispatch(stopSampling());    
  };
}

export function drawWithCurrentTool(position: DrawPosition) {
  return (dispatch: Function, getState: () => ReduxState) => {
    const state = getState();
    const tool = getSelectedTool(state);
    const layer = getCurrentLayer(state);
    const drawing = isDrawing(state);
    if (tool && drawing) {
      const opacity = getCurrentOpacity(state, tool);
      const size = getCurrentSize(state, tool);
      const color = getColor(state);
      const drawParams = {
        position,
        tool,
        size,
        opacity,
        color
      };
      const lastParams = getStoredDrawParams(state);
      if (!lastParams) {
        throw new Error('No last params found.');
      }
      dispatch(storeDrawParams(drawParams));
      dispatch(addSample());
      dispatch(draw(drawParams, lastParams, layer));
    }
  };
}