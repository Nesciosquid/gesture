import { ReduxAction } from '../actions/index';
import { actionTypes } from '../actions/canvas';
import { ToolType } from '../types/tools';
import { DrawParams, DrawPosition } from '../types/canvas';
import { drawLines, drawGradients, drawFromPattern, getBounds,
   getPartialImageData, putPartialImageData, DrawBounds, getColorData } from '../utils/canvas';
import { RGBColor } from 'react-color';

export interface DrawLayer {
  name?: string;
  imageData: ImageData;
}

export interface CanvasState {
  layers: DrawLayer[];
  lastParams?: DrawParams;
}

export const DefaultCanvasState: CanvasState = {
  layers: [{
    name: 'background',
    imageData: getColorData({ r: 211, g: 211, b: 211 }, 1920, 1080)
  },
  {
    name: 'first_layer',
    imageData: new ImageData(1920, 1080)
  }]
};

function setImageData(state: CanvasState, imageData: ImageData, layer: number): CanvasState {
  const layers = state.layers.slice();
  layers[layer].imageData = imageData;
  return { ...state, layers };
}

function draw(state: CanvasState, params: DrawParams, lastParams: DrawParams, layer: number): CanvasState {
  if (!state.layers[layer]) {
    throw new Error('No image data to work from!');
  }
  const imageData = state.layers[layer].imageData;
  const bounds = getBounds(lastParams.position, params.position, 
                           lastParams.size, params.size, imageData.width, imageData.height);
  if (bounds.width === 0 || bounds.height === 0) {
    return { ...state, lastParams: params };
  }

  const partialImageData = new ImageData(getPartialImageData(imageData, bounds).data, bounds.width, bounds.height);
  const lastPosition = lastParams.position;
  const nextPosition = params.position;
  const adjustedLastPosition = { x: lastPosition.x - bounds.minX, y: lastPosition.y - bounds.minY };
  const adjustedNextPosition = { x: nextPosition.x - bounds.minX, y: nextPosition.y - bounds.minY };
  const adjustedLastParams = { ...lastParams, position: adjustedLastPosition };
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
  const layers = state.layers.slice();
  layers[layer].imageData = newImageData;
  return { ...state, lastParams: params, layers};
}

function clear(state: CanvasState, layer: number): CanvasState {
  if (!state.layers[layer]) {
    throw new Error(`Cannot clear layer ${layer} because it does not exist!`);
  }
  const layers = state.layers.slice();
  const imageData = layers[layer].imageData;
  layers[layer].imageData = new ImageData(imageData.width, imageData.height);
  return { ...state, layers };
}

export default function(state: CanvasState = DefaultCanvasState, {type, payload}: ReduxAction): CanvasState {
    switch (type) {
      case(actionTypes.setImageData): {
        return setImageData(state, payload.imageData, payload.layer);
      }
      case(actionTypes.draw): {
        return draw(state, payload.params, payload.lastParams, payload.layer);
      }
      case(actionTypes.clear): {
        return clear(state, payload);
      }
      default:
        return state;
    }
}