import { RGBColor } from 'react-color';
import { DrawPosition, DrawParams } from '../types/canvas';
import Tool from '../types/tools/Tool';
const brushCanvas: HTMLCanvasElement = document.createElement('canvas');
const brushContext = brushCanvas.getContext('2d');
const patternCanvas = document.createElement('canvas');
const patternContext = patternCanvas.getContext('2d');

export async function updateGrainImage(tool: Tool, color: RGBColor): Promise<Tool> {
  if (!tool.grainSource) {
    throw new Error('Tool does not have a grain pattern.');
  }
  const colorized = await colorizeImage(tool.grainSource, color);
  return {
    ...tool,
    grainImage: colorized
  };
}

export async function colorizeImage(image: HTMLImageElement, color: RGBColor): Promise<HTMLImageElement> {
  brushCanvas.width = image.width;
  brushCanvas.height = image.height;
  if (!image.complete || image.naturalWidth === 0) {
    throw new Error(`Pattern image invalid. width: ${image.width}`);
  }
  if (!brushContext) {
    throw new Error('No brush context');
  }
  brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
  brushContext.drawImage(image, 0, 0);  
  const brushData = brushContext.getImageData(0, 0, brushCanvas.width, brushCanvas.height);
  const data = brushData.data;
  const pixelValues = new Uint8ClampedArray(data.length);
  for (var j = 0; j < data.length; j += 4) {
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
  const brushImage = new Image();  
  return new Promise<HTMLImageElement>((resolve) => {
    brushImage.onload = () => {
      resolve(brushImage);
    };
    brushImage.src = brushCanvas.toDataURL();
  });
}

export function distanceBetween(point1: DrawPosition, point2: DrawPosition) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

export function angleBetween(point1: DrawPosition, point2: DrawPosition) {
  return Math.atan2( point2.x - point1.x, point2.y - point1.y );
}

export function drawGradients(context: CanvasRenderingContext2D, params: DrawParams, lastParams: DrawParams) {
  const position = params.position;
  const lastPosition = lastParams.position;
  const distance = distanceBetween(lastPosition, position);
  const angle = angleBetween(lastPosition, position);
  const size = params.size;
  const color = params.color;
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
}

export function midPointBetween(p1: DrawPosition, p2: DrawPosition) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  };
}

export function createPattern(context: CanvasRenderingContext2D, image: HTMLImageElement, 
                              sizeScale: number, sizeJitter: number = 0): CanvasPattern {
  if (!patternContext) {
    throw new Error(`patternContext: ${patternContext}`);
  }
  if (!image.complete || image.naturalWidth === 0) {
    throw new Error(`Pattern image invalid. width: ${image.width}`);
  }
  // const sourcePatternImage = state.sourcePatternImage;
  const targetHeight = (Math.random() * sizeJitter) + sizeScale * image.width;
  const targetWidth = (Math.random() * sizeJitter) + sizeScale * image.height;
  patternCanvas.width = targetHeight;
  patternCanvas.height = targetWidth;
  patternContext.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
  patternContext.drawImage(image, 0, 0, targetHeight, targetWidth);
  return context.createPattern(patternCanvas, 'repeat');
}

export function drawLines(context: CanvasRenderingContext2D, params: DrawParams, lastParams: DrawParams) {
  const color = params.color;
  context.lineWidth = params.size;
  context.lineJoin = context.lineCap = 'round';  
  context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${(color.a ? color.a : 1)}`;
  drawLineSegments(context, 1, params, lastParams);
}

export function drawCurves(context: CanvasRenderingContext2D, params: DrawParams, lastParams: DrawParams) {
  const color = params.color;
  const position = params.position;
  context.lineWidth = params.size;
  context.lineJoin = context.lineCap = 'round';  
  context.lineJoin = context.lineCap = 'round';
  context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ? color.a : 1})`;
  context.beginPath();
  const midpoint = midPointBetween(lastParams.position, position);
  context.moveTo(lastParams.position.x, lastParams.position.y);
  context.quadraticCurveTo(midpoint.x, midpoint.y, position.x, position.y);
  context.stroke();    
}

export function drawLineSegments(context: CanvasRenderingContext2D, minDistance: number, 
                                 params: DrawParams, lastParams: DrawParams) {
  const start = lastParams.position;
  const end = params.position;
  const distance = distanceBetween(start, end);
  const angle = angleBetween(start, end);
  let lastX = start.x;
  let lastY = start.y;
  context.moveTo(start.x, start.y);    
  for (let z = 0 ; z < distance; z += minDistance ) {
    const x = start.x + (Math.sin(angle) * z);
    const y = start.y + (Math.cos(angle) * z);
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
    context.stroke();
    lastX = x;
    lastY = y;
  }
  context.beginPath();
  context.moveTo(lastX, lastY);
  context.lineTo(end.x, end.y);
  context.stroke();
}

export function drawFromPattern(context: CanvasRenderingContext2D, 
                                params: DrawParams, lastParams: DrawParams) {
  const tool = params.tool;
  if (tool.grainImage) {
    context.lineWidth = params.size;
    context.lineJoin = context.lineCap = 'round';  
    const grainScale = tool.grainScale ? tool.grainScale : 1;
    context.strokeStyle = createPattern(context, tool.grainImage, grainScale, 10);
    drawLineSegments(context, params.size / 2, params, lastParams);
  }
}