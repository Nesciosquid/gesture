import { ReduxAction } from '../actions/index';
import { actionTypes, RectParams } from '../actions/canvas';
import { RGBColor } from 'react-color';
const brushCanvas: HTMLCanvasElement = document.createElement('canvas');
const brushContext = brushCanvas.getContext('2d');
const patternCanvas = document.createElement('canvas');
const patternContext = patternCanvas.getContext('2d');

export enum ToolType {
  CURVES,
  IMAGE,
  PATTERN,
  LINES,
  GRADIENTS,
}

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
  sourcePatternImage?: HTMLImageElement;
  patternBrush?: HTMLImageElement;
  colorizedImage?: HTMLImageElement;
  points: DrawPosition[];
  tool: ToolType;
}

function setSourceImage(state: CanvasState, image: HTMLImageElement) {
  return { ...state, sourceImage: image };
}

function setPatternImage(state: CanvasState, image: HTMLImageElement) {
  return { ...state, sourcePatternImage: image, patternBrush: generateBrushImage(image, state.drawColor) };
}

function generateBrushImage(source: HTMLImageElement, color: RGBColor) {
  brushCanvas.width = source.width;
  brushCanvas.height = source.height;
  const brushImage = new Image();
  if (brushContext) {
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
    brushContext.drawImage(source, 0, 0);  
    const brushData = brushContext.getImageData(0, 0, brushCanvas.width, brushCanvas.height);
    const data = brushData.data;
    const pixelValues = new Uint8ClampedArray(data.length);
    for (var j = 0; j < data.length; j += 4) {
      // red
      const r = Math.round((color.r / 255) * data[j]);
      const g = Math.round((color.g / 255) * data[j + 1]);
      const b = Math.round((color.b / 255) * data[j + 2]); 
      const a = Math.round((data[j + 3]));
      pixelValues[j] = r;
      pixelValues[j + 1] = g;
      pixelValues[j + 2] = b;
      pixelValues[j + 3] = a;
    }
    brushContext.putImageData(new ImageData(pixelValues, brushCanvas.width, brushCanvas.height), 0, 0);
    brushImage.src = brushCanvas.toDataURL('image/png');
  }
  return brushImage;
}

function setDrawColor(state: CanvasState, color: RGBColor): CanvasState {
  const updatedState = { ...state, drawColor: color };
  if (!state.sourcePatternImage) {
    return updatedState;
  } else {
    return { ...updatedState, patternBrush: generateBrushImage(state.sourcePatternImage, color)};
  }
}

export const DefaultCanvasState: CanvasState = {
  drawing: false,
  drawColor: { r: 0, g: 0, b: 0, a: 1},
  lastPosition: { x: 0, y: 0},
  points: [],
  tool: ToolType.PATTERN
};

function setContext(state: CanvasState, context: CanvasRenderingContext2D) {
  return { ...state, context };
}

function startDrawing(state: CanvasState, position: DrawPosition) {
  return { ... state, drawing: true, lastPosition: position, points: state.points.slice().concat([position]) };
}

function stopDrawing(state: CanvasState) {
  return { ... state, drawing: false, points: [] };
}

function setToolType(state: CanvasState, tool: ToolType) {
  return { ...state, tool };
}

function distanceBetween(point1: DrawPosition, point2: DrawPosition) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function angleBetween(point1: DrawPosition, point2: DrawPosition) {
  return Math.atan2( point2.x - point1.x, point2.y - point1.y );
}

function drawGradients(state: CanvasState, params: DrawParams) {
  const context = state.context;
  if (!context || !state.sourceImage) {
    return state;
  }
  context.lineJoin = context.lineCap = 'round';
  const lastPosition = state.lastPosition;
  const position = params.position;
  const distance = distanceBetween(lastPosition, position);
  const angle = angleBetween(lastPosition, position);
  const size = params.size;
  const color = state.drawColor;
  const r = color.r;
  const g = color.g;
  const b = color.b;
  const a = (color.a ? color.a : 1);
  const startColor = `rgba(${r},${g},${b},${a})`;  
  const midColor = `rgba(${r},${g},${b},${a * .5})`;  
  const endColor = `rgba(${r},${g},${b},0)`;  

  for (let i = 0; i < distance; i += 1) {
    const x = lastPosition.x + (Math.sin(angle) * i);
    const y = lastPosition.y + (Math.cos(angle) * i);
    var gradient = context.createRadialGradient(x, y, size / 4, x, y, size / 2);    
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(0.5, midColor);
    gradient.addColorStop(1, endColor);
    context.fillStyle = gradient;

    context.fillStyle = gradient;
    context.fillRect(x - params.size / 2, y - params.size / 2, size, size);
  }
  return { ...state, lastPosition: position };
}

function drawFromImage(state: CanvasState, params: DrawParams) {
  const context = state.context;
  if (!context || !state.sourceImage) {
    return state;
  }
  context.lineJoin = context.lineCap = 'round';
  const lastPosition = state.lastPosition;
  const distance = distanceBetween(state.lastPosition, params.position);
  const angle = angleBetween(state.lastPosition, params.position);
  const size = params.size;
  context.lineWidth = params.size;
  context.lineJoin = context.lineCap = 'round';  
  context.fillStyle = getSourceImagePattern(state);
  context.fill();
  for (let i = 0; i < distance; i += 10) {
    const x = lastPosition.x + (Math.sin(angle) * i) - size / 2;
    const y = lastPosition.y + (Math.cos(angle) * i) - size / 2;
    context.beginPath();
    context.ellipse(x, y, size / 2, size / 2, 0, 0, Math.PI * 2);
    context.closePath();    
  }
  return { ...state, lastPosition: params.position };
}

function midPointBetween(p1: DrawPosition, p2: DrawPosition) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  };
}

// function getDotPattern(state: CanvasState): CanvasPattern {
//   if (!state.context || !patternContext) {
//     throw new Error('wat');
//   }
//   const dotWidth = 40;
//   const dotSpacing = 5;
//   const canvasSize = dotWidth + dotSpacing;
//   patternCanvas.width = patternCanvas.height = canvasSize;
//   patternContext.fillStyle = 'red';
//   patternContext.beginPath();
//   patternContext.arc(dotWidth / 2, dotWidth / 2, dotWidth / 2, 0, Math.PI * 2, false);
//   patternContext.closePath();
//   patternContext.fill();
//   return state.context.createPattern(patternCanvas, 'repeat');
// }

function getSourceImagePattern(state: CanvasState): CanvasPattern {
  if (!state.context || !patternContext || !state.patternBrush) {
    throw new Error(`context: ${state.context}, patternContext: ${patternContext}, sourcePatternImage: ${state.sourcePatternImage}`);
  }
  // const sourcePatternImage = state.sourcePatternImage;
  const targetHeight = (Math.random() * 10) + 30;
  const targetWidth = (Math.random() * 10) + 30;
  patternCanvas.width = targetHeight;
  patternCanvas.height = targetWidth;
  patternContext.drawImage(state.patternBrush, 0, 0, targetHeight, targetWidth);
  return state.context.createPattern(patternCanvas, 'repeat');
}

function drawLines(state: CanvasState, params: DrawParams) {
  if (!state.context || !patternContext || !state.sourcePatternImage) {
    throw new Error(`context: ${state.context}, patternContext: ${patternContext}, sourcePatternImage: ${state.sourcePatternImage}`);
  }
  const lastPosition = state.lastPosition;
  const context: CanvasRenderingContext2D = state.context;
  const color = state.drawColor;
  const position = params.position;
  context.lineWidth = params.size;
  context.lineJoin = context.lineCap = 'round';  
  context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${(color.a ? color.a : 1)}`;
  const distance = distanceBetween(state.lastPosition, params.position);
  const angle = angleBetween(state.lastPosition, params.position);
  let lastX = lastPosition.x;
  let lastY = lastPosition.y;
  for (let z = 0 ; z < distance; z += 1 ) {
    const x = lastPosition.x + (Math.sin(angle) * z);
    const y = lastPosition.y + (Math.cos(angle) * z);
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
    context.stroke();
    lastX = x;
    lastY = y;
  }
  context.beginPath();
  context.moveTo(lastX, lastY);
  context.lineTo(params.position.x, params.position.y);
  context.stroke();
  return { ...state, lastPosition: position };
}

function drawCurves(state: CanvasState, params: DrawParams) {
  if (!state.context || !patternContext || !state.sourcePatternImage) {
    throw new Error(`context: ${state.context}, patternContext: ${patternContext}, sourcePatternImage: ${state.sourcePatternImage}`);
  }
  const lastPosition = state.lastPosition;
  const context: CanvasRenderingContext2D = state.context;
  const color = state.drawColor;
  const position = params.position;
  context.lineWidth = params.size;
  context.lineJoin = context.lineCap = 'round';  
  context.lineJoin = context.lineCap = 'round';
  context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ? color.a : 1})`;
  context.beginPath();
  const midpoint = midPointBetween(lastPosition, position);
  context.moveTo(lastPosition.x, lastPosition.y);
  context.quadraticCurveTo(midpoint.x, midpoint.y, position.x, position.y);
  context.stroke();    
  return { ...state, lastPosition: position };
}

function drawFromPattern(state: CanvasState, params: DrawParams) {
  if (!state.context || !patternContext || !state.sourcePatternImage) {
    throw new Error(`context: ${state.context}, patternContext: ${patternContext}, sourcePatternImage: ${state.sourcePatternImage}`);
  }
  const lastPosition = state.lastPosition;
  const context: CanvasRenderingContext2D = state.context;
  const position = params.position;
  context.lineWidth = params.size;
  context.lineJoin = context.lineCap = 'round';  
  context.strokeStyle = getSourceImagePattern(state);
  context.moveTo(lastPosition.x, lastPosition.y);
  const distance = distanceBetween(state.lastPosition, params.position);
  const angle = angleBetween(state.lastPosition, params.position);
  let lastX = lastPosition.x;
  let lastY = lastPosition.y;
  for (let z = 0 ; z < distance; z += params.size / 2 ) {
    const x = lastPosition.x + (Math.sin(angle) * z);
    const y = lastPosition.y + (Math.cos(angle) * z);
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
    context.stroke();
    lastX = x;
    lastY = y;
  }
  context.beginPath();
  context.moveTo(lastX, lastY);
  context.lineTo(params.position.x, params.position.y);
  context.stroke();
  return { ...state, lastPosition: position };
}

function draw(state: CanvasState, params: DrawParams) {
  if (!state.drawing || !state.context) {
    return state;
  } 
  state.context.globalAlpha = params.opacity;
  switch (state.tool) {
    case (ToolType.CURVES): {
      return drawCurves(state, params);
    }
    case (ToolType.IMAGE): {
      return drawFromImage(state, params);
    }
    case (ToolType.PATTERN): {
      return drawFromPattern(state, params);
    } 
    case (ToolType.LINES): {
      return drawLines(state, params);
    }
    case (ToolType.GRADIENTS): {
      return drawGradients(state, params);
    } 
    default: {
      return drawCurves(state, params);
    }
  }
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
      case(actionTypes.setPatternImage): {
        return setPatternImage(state, payload);
      }
      case(actionTypes.stopDrawing): {
        return stopDrawing(state);
      }
      case(actionTypes.setToolType): {
        return setToolType(state, payload);
      }
       default:
        return state;
    }
}