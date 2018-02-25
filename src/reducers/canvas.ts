import { ReduxAction } from '../actions/index';
import { actionTypes } from '../actions/canvas';
import { ToolType } from '../types/tools';
import { DrawParams, DrawPosition } from '../types/canvas';
import { drawLines, drawGradients, drawFromPattern, getBounds,
   getPartialImageData, putPartialImageData, DrawBounds } from '../utils/canvas';
import { TransformMatrix, Transform } from '../utils/transform';

export interface CanvasState {
  imageData?: ImageData;
  dirtyBounds?: DrawBounds;
  lastParams?: DrawParams;
  drawing: boolean;
  points: DrawPosition[];
  transformMatrix: TransformMatrix;
}

export const DefaultCanvasState: CanvasState = {
  drawing: false,
  points: [],
  transformMatrix: new Transform().matrix
};

function setTransform(state: CanvasState, matrix: TransformMatrix) {
  return { ...state, transformMatrix: matrix };
}

function setImageData(state: CanvasState, imageData: ImageData) {
  return { ...state, imageData };
}

function startDrawing(state: CanvasState, params: DrawParams): CanvasState {
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
  const lastParams = state.lastParams;
  const bounds = getBounds(lastParams.position, params.position, 
                           lastParams.size, params.size, imageData.width, imageData.height);
  if (bounds.width === 0 || bounds.height === 0) {
    return { ...state, lastParams: params, imageData: imageData };
  }
  const partialImageData = new ImageData(getPartialImageData(imageData, bounds).data, bounds.width, bounds.height);
  const lastPosition = lastParams.position;
  const nextPosition = params.position;
  const adjustedLastPosition = { x: lastPosition.x - bounds.minX, y: lastPosition.y - bounds.minY };
  const adjustedNextPosition = { x: nextPosition.x - bounds.minX, y: nextPosition.y - bounds.minY };
  const adjustedLastParams = { ...state.lastParams, position: adjustedLastPosition };
  const adjustedNextParams = { ...params, position: adjustedNextPosition };

  let modifiedPartialData: ImageData;
  switch (params.tool.type) {
    case (ToolType.PATTERN): {
      modifiedPartialData = drawFromPattern(partialImageData, adjustedNextParams, adjustedLastParams);
      break;
    } 
    case (ToolType.LINES): {
      modifiedPartialData = drawLines(partialImageData, adjustedNextParams, adjustedLastParams);
      break;
    }
    case (ToolType.GRADIENTS): {
      modifiedPartialData = drawGradients(partialImageData, adjustedNextParams, adjustedLastParams);
      break;
    }
    default: {
      modifiedPartialData = partialImageData;
    }
  }

  const newData = putPartialImageData(imageData, modifiedPartialData, bounds);
  const newImageData = new ImageData(newData.data, newData.width, newData.height);
  return { ...state, lastParams: params, imageData: newImageData, dirtyBounds: bounds};
}

function clear(state: CanvasState) {
  if (!state.imageData) {
    return state;
  }
  const bounds: DrawBounds = {
    minX: 0,
    minY: 0,
    maxX: state.imageData.width,
    maxY: state.imageData.height,
    width: state.imageData.width,
    height: state.imageData.height
  };
  return { ...state, imageData: new ImageData(state.imageData.width, state.imageData.height), dirtyBounds: bounds };
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
      case(actionTypes.setTransform): {
        return setTransform(state, payload);
      }
      case(actionTypes.clear): {
        return clear(state);
      }
      default:
        return state;
    }
}