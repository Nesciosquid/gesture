import { ReduxAction } from '../actions/index';
import { actionTypes } from '../actions/viewport';
import { DrawParams } from '../types/canvas';
import { drawLines, drawGradients, drawFromPattern, getBounds,
   getPartialImageData, putPartialImageData, DrawBounds } from '../utils/canvas';
import { TransformMatrix, Transform } from '../utils/transform';

export interface GestureParams {
  rotation: number;
  center: { x: number, y: number };
  angle: number;
  deltaX: number;
  deltaY: number;
  scale: number;
}

export interface ViewportState {
  drawing: boolean;
  storedGestureParams?: GestureParams;
  storedDrawParams?: DrawParams;
}

export const DefaultViewportState: ViewportState = {
  drawing: false,
};

function clearGestureParams(state: ViewportState): ViewportState {
  return { ...state, storedGestureParams: undefined };
}

function storeGestureParams(state: ViewportState, params: GestureParams): ViewportState {
  return { ...state, storedGestureParams: params };
}

function storeDrawParams(state: ViewportState, params: DrawParams): ViewportState {
  return { ...state, storedDrawParams: params };
}

function clearDrawParams(state: ViewportState): ViewportState {
  return { ...state, storedDrawParams: undefined };
}

function startDrawing(state: ViewportState, params: DrawParams): ViewportState {
  return { ... state, drawing: true, storedDrawParams: params };
}

function stopDrawing(state: ViewportState): ViewportState {
  return { ... state, drawing: false };
}

export default function(state: ViewportState = DefaultViewportState, {type, payload}: ReduxAction): ViewportState {
    switch (type) {
       case(actionTypes.startDrawing): {
        return startDrawing(state, payload);
      }
      case(actionTypes.stopDrawing): {
        return stopDrawing(state);
      }
      case(actionTypes.storeDrawParams): {
        return storeDrawParams(state, payload);
      }
      case(actionTypes.clearDrawParams): {
        return clearDrawParams(state);
      }
      case(actionTypes.storeGestureParams): {
        return storeGestureParams(state, payload);
      }
      case(actionTypes.clearGestureParams): {
        return clearGestureParams(state);
      }
      default:
        return state;
    }
}