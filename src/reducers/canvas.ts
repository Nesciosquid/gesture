import { ReduxAction } from '../actions/index';
import { actionTypes } from '../actions/canvas';
import { ToolType } from '../types/tools';
import { DrawParams, DrawPosition } from '../types/canvas';
import { drawLines, drawGradients, drawFromPattern } from '../utils/canvas';

export interface CanvasState {
  imageData?: ImageData;
  lastParams?: DrawParams;
  drawing: boolean;
  points: DrawPosition[];
}

export const DefaultCanvasState: CanvasState = {
  drawing: false,
  points: [],
};

function setImageData(state: CanvasState, imageData: ImageData) {
  return { ...state, imageData };
}

function startDrawing(state: CanvasState, params: DrawParams) {
  return { ... state, drawing: true, lastParams: params };
}

function stopDrawing(state: CanvasState) {
  return { ... state, drawing: false, points: [] };
}

function draw(state: CanvasState, params: DrawParams) {
  if (!state.drawing || !state.lastParams) {
    return state;
  } 
  if (!state.imageData) {
    throw new Error('No image data to work from!');
  }
  const imageData = state.imageData;
  let newImageData: ImageData;
  switch (params.tool.type) {
    case (ToolType.PATTERN): {
      newImageData = drawFromPattern(imageData, params, state.lastParams);
      break;
    } 
    case (ToolType.LINES): {
      newImageData = drawLines(imageData, params, state.lastParams);
      break;
    }
    case (ToolType.GRADIENTS): {
      newImageData = drawGradients(imageData, params, state.lastParams);
      break;
    }
    default: {
      newImageData = imageData;
    }
  }
  return { ...state, lastParams: params, imageData: newImageData};
}

function clear(state: CanvasState) {
  if (!state.imageData) {
    return state;
  }
  return { ...state, imageData: new ImageData(state.imageData.width, state.imageData.height)};
}

export default function(state: CanvasState = DefaultCanvasState, {type, payload}: ReduxAction): CanvasState {
    switch (type) {
       case(actionTypes.setImageData): {
         return setImageData(state, payload);
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