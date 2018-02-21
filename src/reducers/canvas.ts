import { ReduxAction } from '../actions/index';
import { actionTypes, RectParams } from '../actions/canvas';
import { RGBColor } from 'react-color';

export interface DrawPosition {
  x: number;
  y: number;
}

export interface DrawParams {
  position: DrawPosition;
  opacity: number;
  size: number;
}

export interface CanvasState {
  context?: CanvasRenderingContext2D;
  lastPosition: DrawPosition;
  drawing: boolean;
  drawColor: RGBColor;
  sourceImage?: HTMLImageElement;
  colorizedImage?: HTMLImageElement;
}

function setSourceImage(state: CanvasState, image: HTMLImageElement) {
  return setDrawColor({ ...state, sourceImage: image }, state.drawColor);
}

function setDrawColor(state: CanvasState, color: RGBColor): CanvasState {
  if (!state.sourceImage) {
    return { ...state, drawColor: color };
  }
  const brushCanvas: HTMLCanvasElement = document.createElement('canvas');
  const brushContext = brushCanvas.getContext('2d');
  brushCanvas.width = state.sourceImage.width;
  brushCanvas.height = state.sourceImage.height;
  const colorized = new Image();
  if (brushContext) {
    brushContext.drawImage(state.sourceImage, 0, 0);  
    const brushData = brushContext.getImageData(0, 0, brushCanvas.width, brushCanvas.height);
    const data = brushData.data;
    for (var j = 0; j < data.length; j += 4) {
      // red
      data[j] = Math.round((color.r) * data[j]);
      // green
      data[j + 1] = Math.round((color.g) * data[j + 1]);
      // blue
      data[j + 2] = Math.round((color.b) * data[j + 2]);
      let targetAlpha;
      if (color.a) {
        targetAlpha = color.a;        
      } else {
        targetAlpha = 1;
      }
      data[j + 3] = Math.round((targetAlpha) * data[j + 3]);      
    }
    brushContext.putImageData(brushData, 0, 0);
    colorized.src = brushCanvas.toDataURL('image/png');
  }
  return { ...state, colorizedImage: colorized, drawColor: color };
}

export const DefaultCanvasState: CanvasState = {
  drawing: false,
  drawColor: { r: 0, g: 0, b: 0, a: 1},
  lastPosition: { x: 0, y: 0}
};

function setContext(state: CanvasState, context: CanvasRenderingContext2D) {
  return { ...state, context };
}

function startDrawing(state: CanvasState, position: DrawPosition) {
  return { ... state, drawing: true, lastPosition: position };
}

function stopDrawing(state: CanvasState) {
  return { ... state, drawing: false };
}

function distanceBetween(point1: DrawPosition, point2: DrawPosition) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function angleBetween(point1: DrawPosition, point2: DrawPosition) {
  return Math.atan2( point2.x - point1.x, point2.y - point1.y );
}

function draw(state: CanvasState, params: DrawParams) {
  const context = state.context;
  if (!context || !state.drawing || !state.colorizedImage) {
    return state;
  }
  context.globalAlpha = params.opacity;
  context.lineJoin = context.lineCap = 'round';
  const lastPosition = state.lastPosition;
  const position = params.position;
  const distance = distanceBetween(lastPosition, position);
  const angle = angleBetween(lastPosition, position);
  const size = params.size;
  for (let i = 0; i < distance; i++) {
    const x = lastPosition.x + (Math.sin(angle) * i) - params.size / 2;
    const y = lastPosition.y + (Math.cos(angle) * i) - params.size / 2;
    context.drawImage(state.colorizedImage, x, y, size, size);
  }
  return { ...state, lastPosition: position };
}

function drawRect(state: CanvasState, params: RectParams) {
  const context = state.context;
  if (!context) {
    return state;
  }
  context.fillRect(params.x, params.y, params.width, params.height);  
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
       case(actionTypes.drawRect): {
         return drawRect(state, payload);
       }
       case(actionTypes.startDrawing): {
        return startDrawing(state, payload);
      }
      case(actionTypes.setDrawColor): {
        return setDrawColor(state, payload);
      }
      case(actionTypes.setSourceImage): {
        return setSourceImage(state, payload);
      }
      case(actionTypes.stopDrawing): {
        return stopDrawing(state);
      }
       default:
        return state;
    }
}