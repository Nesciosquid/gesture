import { ReduxAction } from '../actions/index';
import { actionTypes } from '../actions/canvas';
import { ToolType } from '../types/tools';
import { DrawParams, DrawPosition } from '../types/canvas';
import { drawCurves, drawLines, drawGradients, drawFromPattern } from '../utils/canvas';

export interface CanvasState {
  context?: CanvasRenderingContext2D;
  lastParams?: DrawParams;
  drawing: boolean;
  points: DrawPosition[];
}

export const DefaultCanvasState: CanvasState = {
  drawing: false,
  points: [],
};

function setContext(state: CanvasState, context: CanvasRenderingContext2D) {
  return { ...state, context };
}

function startDrawing(state: CanvasState, params: DrawParams) {
  return { ... state, drawing: true, lastParams: params };
}

function stopDrawing(state: CanvasState) {
  return { ... state, drawing: false, points: [] };
}

function draw(state: CanvasState, params: DrawParams) {
  const context = state.context;  
  if (!state.drawing || !context || !state.lastParams) {
    return state;
  } 
  if (params.tool.erase) {
    context.globalCompositeOperation = 'destination-out';
  } else {
    context.globalCompositeOperation = 'source-over';
  }
  context.globalAlpha = params.opacity;
  switch (params.tool.type) {
    case (ToolType.CURVES): {
      drawCurves(context, params, state.lastParams);
      break;
    }
    case (ToolType.PATTERN): {
      drawFromPattern(context, params, state.lastParams);
      break;
    } 
    case (ToolType.LINES): {
      drawLines(context, params, state.lastParams);
      break;
    }
    case (ToolType.GRADIENTS): {
      drawGradients(context, params, state.lastParams);
      break;
    }
    default: {
      drawLines(context, params, state.lastParams);
    }
  }
  return { ...state, lastParams: params };
}

function clear(state: CanvasState) {
  if (state.context) {
    state.context.clearRect(0, 0, state.context.canvas.width, state.context.canvas.height);
  }
  return state;
}

export default function(state: CanvasState = DefaultCanvasState, {type, payload}: ReduxAction): CanvasState {
    switch (type) {
       case(actionTypes.setContext): {
         return setContext(state, payload);
       }
       case(actionTypes.draw): {
         return draw(state, payload);
       }
       case(actionTypes.startDrawing): {
        return startDrawing(state, payload);
      }
      case(actionTypes.stopDrawing): {
        return stopDrawing(state);
      }
      case(actionTypes.clear): {
        return clear(state);
      }
      default:
        return state;
    }
}