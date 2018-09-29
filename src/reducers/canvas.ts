import { ReduxAction } from '../actions/index';
import { actionTypes } from '../actions/canvas';
import { ToolType } from '../types/tools';
import { DrawParams, DrawPosition } from '../types/canvas';
import { drawLines, drawGradients, drawFromPattern, getBounds, getPartialImageData, 
  putPartialImageData, DrawBounds, getColorData, updateFromLayers, combineLayers, 
  getFullBounds, drawLinesInContext, drawFromPatternInContext, drawGradientsInContext } from '../utils/canvas';
import { RGBColor } from 'react-color';
import { TransformMatrix, Transform } from '../utils/transform';
import { defaultWidth, defaultHeight } from '../utils/constants';

let drawingCanvas: HTMLCanvasElement;
let bufferCanvas: HTMLCanvasElement;

export interface DrawLayer {
  name?: string;
  imageData: ImageData;
}

export interface CanvasState {
  layers: DrawLayer[];
  lastParams?: DrawParams;
  dirtyBounds: DrawBounds;
  flatImageData: ImageData;
  transformMatrix: TransformMatrix;  
}

const backgroundData = getColorData({ r: 211, g: 211, b: 211 }, defaultWidth, defaultHeight);
const initialLayers = [{
  name: 'background',
  imageData: backgroundData
},
{
  name: 'first_layer',
  imageData: new ImageData(defaultWidth, defaultHeight)
}];
export const DefaultCanvasState: CanvasState = {
  layers: initialLayers,
  flatImageData: combineLayers(initialLayers),
  dirtyBounds: getFullBounds(backgroundData),
  transformMatrix: new Transform().matrix,  
};

function setImageData(state: CanvasState, imageData: ImageData, layer: number): CanvasState {
  const layers = state.layers.slice();
  layers[layer].imageData = imageData;
  return { ...state, layers };
}

function setOwnDrawingCanvas(state: CanvasState, canvas: HTMLCanvasElement) {
  drawingCanvas = canvas;
  return state;
}

function setOwnBufferCanvas(state: CanvasState, canvas: HTMLCanvasElement) {
  bufferCanvas = canvas;
  return state;
}

async function redrawCanvas (transform: TransformMatrix) {
  if (drawingCanvas && bufferCanvas) {
    const context = drawingCanvas.getContext('2d') as CanvasRenderingContext2D;
    const bufferContext = bufferCanvas.getContext('2d') as CanvasRenderingContext2D;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);          
    context.setTransform(transform.scX, transform.skX, transform.skY, transform.scY, transform.tX, transform.tY);
    context.drawImage(bufferCanvas, 0, 0);
  }
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

  // const partialImageData = new ImageData(getPartialImageData(imageData, bounds).data, bounds.width, bounds.height);
  // const lastPosition = lastParams.position;
  // const nextPosition = params.position;
  // const adjustedLastPosition = { x: lastPosition.x - bounds.minX, y: lastPosition.y - bounds.minY };
  // const adjustedNextPosition = { x: nextPosition.x - bounds.minX, y: nextPosition.y - bounds.minY };
  // const adjustedLastParams = { ...lastParams, position: adjustedLastPosition };
  // const adjustedNextParams = { ...params, position: adjustedNextPosition };

  // let modifiedPartialData: ImageData;
  // switch (params.tool.type) {
  //   case (ToolType.PATTERN): {
  //     modifiedPartialData = drawFromPattern(partialImageData, adjustedNextParams, adjustedLastParams);
  //     break;
  //   } 
  //   case (ToolType.LINES): {
  //     modifiedPartialData = drawLines(partialImageData, adjustedNextParams, adjustedLastParams);
  //     break;
  //   }
  //   case (ToolType.GRADIENTS): {
  //     modifiedPartialData = drawGradients(partialImageData, adjustedNextParams, adjustedLastParams);
  //     break;
  //   }
  //   default: {
  //     modifiedPartialData = partialImageData;
  //   }
  // }

  // const newData = putPartialImageData(imageData, modifiedPartialData, bounds);
  // const newImageData = new ImageData(newData.data, newData.width, newData.height);
  // const layers = state.layers.slice();
  // layers[layer].imageData = newImageData;
  // const flatData = updateFromLayers(state.flatImageData, layers, bounds);
  // // const flatData = combineLayers(layers); 

  // return { ...state, lastParams: params, layers, dirtyBounds: bounds, flatImageData: flatData };
  
  const lastPosition = lastParams.position;
  const nextPosition = params.position;

  let newData: ImageData;
  const bufferContext = bufferCanvas.getContext('2d');

  if (bufferContext) {
    switch (params.tool.type) {
      case (ToolType.PATTERN): {
        drawFromPatternInContext(bufferContext, params, lastParams);
        break;
      } 
      case (ToolType.LINES): {
        drawLinesInContext(bufferContext, params, lastParams);
        break;
      }
      case (ToolType.GRADIENTS): {
        drawGradientsInContext(bufferContext, params, lastParams);
        break;
      }
      default: 
        break;
    }
  }
  
  const layers = state.layers.slice();
  // layers[layer].imageData = newData;
  // const flatData = updateFromLayers(state.flatImageData, layers, bounds);
  // const flatData = combineLayers(layers); 
  redrawCanvas(state.transformMatrix);
  return { ...state, lastParams: params, layers, dirtyBounds: bounds, flatImageData: state.flatImageData };
}

function clear(state: CanvasState, layer: number): CanvasState {
  if (!state.layers[layer]) {
    throw new Error(`Cannot clear layer ${layer} because it does not exist!`);
  }
  const layers = state.layers.slice();
  if (bufferCanvas) {
    const bufferContext = bufferCanvas.getContext('2d');
    if (bufferContext) {
      bufferContext.putImageData(new ImageData(bufferCanvas.width, bufferCanvas.height), 0, 0);
    }
  }
  redrawCanvas(state.transformMatrix);
  // const imageData = layers[layer].imageData;
  // layers[layer].imageData = new ImageData(imageData.width, imageData.height);
  // const flattenedImageData = combineLayers(layers);
  return { ...state, layers, flatImageData: state.flatImageData, dirtyBounds: getFullBounds(state.flatImageData) };
}

function setTransform(state: CanvasState, matrix: TransformMatrix): CanvasState {
  redrawCanvas(matrix);
  return { ...state, transformMatrix: matrix };
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
      case(actionTypes.setBufferCanvas): {
        return setOwnBufferCanvas(state, payload.canvas);
      }
      case(actionTypes.setCanvas): {
        return setOwnDrawingCanvas(state, payload.canvas);
      }
      case(actionTypes.setTransform): {
        return setTransform(state, payload);
      }
      default:
        return state;
    }
}