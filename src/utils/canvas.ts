import { RGBColor } from 'react-color';
import { DrawPosition, DrawParams } from '../types/canvas';
import Tool from '../types/tools/Tool';
import lerp from 'lerp';
import * as FileSaver from 'file-saver';
import * as _ from 'lodash';

const bufferCanvas: HTMLCanvasElement = document.createElement('canvas');
const bufferContext = bufferCanvas.getContext('2d') as CanvasRenderingContext2D;
const patternCanvas: HTMLCanvasElement = document.createElement('canvas');
const patternContext = patternCanvas.getContext('2d') as CanvasRenderingContext2D;

export interface ImageDataWrapper {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export function saveToPng(imageData: ImageData, name: string) {
  initCanvas(bufferCanvas, imageData.width, imageData.height, imageData);
  bufferCanvas.toBlob((blob) => {
    if (blob) {
      FileSaver.saveAs(blob, `${name}.png`);      
    } else { 
      throw new Error('Unable to save image.');
    }
  });
}

export function getAllImageData(context: CanvasRenderingContext2D) {
  return context.getImageData(0, 0, context.canvas.width, context.canvas.height);
}

export async function updateGrainImage(tool: Tool, color: RGBColor): Promise<Tool> {
  if (!tool.grainSource) {
    throw new Error('Tool does not have a grain pattern.');
  }
  const grainData = getImageData(tool.grainSource);
  const colorized = await colorizeImageData(grainData, color);
  const colorizedImage = await getImage(colorized);
  return {
    ...tool,
    grainImage: colorizedImage
  };
}

export function colorizeImageData(imageData: ImageDataWrapper, color: RGBColor) {
  const data = imageData.data;
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
  return new ImageData(pixelValues, imageData.width, imageData.height);
}

export function distanceBetween(point1: DrawPosition, point2: DrawPosition) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

export function angleBetween(point1: DrawPosition, point2: DrawPosition) {
  return Math.atan2( point2.x - point1.x, point2.y - point1.y );
}

export interface DrawBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
}

export function getBounds(point1: DrawPosition, point2: DrawPosition,
                          size1: number, size2: number, width: number, height: number): DrawBounds {
  const sizeOffset = Math.ceil(Math.max(size1, size2) / 2);                            
  if (sizeOffset < 0 ) {
    throw new Error(`Size cannot be negative: ${size1}, ${size2}`);
  }
  if (width < 0 || height < 0 ) {
    throw new Error(`Width and height cannot be negative: ${width}, ${height}`);
  }
  const minX = Math.floor(Math.min(point1.x, point2.x) - sizeOffset);
  const minY = Math.floor(Math.min(point1.y, point2.y) - sizeOffset);
  const maxX = Math.ceil(Math.max(point1.x, point2.x) + sizeOffset + 1);
  const maxY = Math.ceil(Math.max(point1.y, point2.y) + sizeOffset + 1);
  const minXLimit = _.clamp(minX, 0, width);
  const maxXLimit = _.clamp(maxX, 0, width);
  const minYLimit = _.clamp(minY, 0, height);
  const maxYLimit = _.clamp(maxY, 0, height);
  return {
    minX: minXLimit,
    maxX: maxXLimit,
    minY: minYLimit,
    maxY: maxYLimit,
    width: maxXLimit - minXLimit,
    height: maxYLimit - minYLimit
  };
}

export function initCanvas(canvas: HTMLCanvasElement, width: number, height: number, imageData?: ImageData) {
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('No buffer context found!');
  }
  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  if (imageData) {
    context.putImageData(imageData, 0, 0);
  }
}

export function setGlobalParams(context: CanvasRenderingContext2D, params: DrawParams, 
                                lastParams: DrawParams, ratio: number) {
  const opacity = lerp(lastParams.opacity, params.opacity, ratio);
  const size = lerp(lastParams.size, params.size, ratio);
  context.globalAlpha = opacity;
  context.lineWidth = size;
  if (params.tool.erase) {
    context.globalCompositeOperation = 'destination-out';
  } else {
    context.globalCompositeOperation = 'source-over';
  }
}

export function putPartialImageData(targetImageData: ImageDataWrapper, partialData: ImageDataWrapper, 
                                    bounds: DrawBounds): ImageDataWrapper {
  const newData = targetImageData.data.slice();
  for (let i = bounds.minY; i < bounds.maxY; i++) {
    const yOffset = i * targetImageData.width * 4;
    const xStartOffset = bounds.minX * 4;
    const startIndex = yOffset + xStartOffset;

    const partialDataStartIndex = (i - bounds.minY) * bounds.width * 4;
    const partialDataEndIndex = partialDataStartIndex + bounds.width * 4;
    const rowData = partialData.data.slice(partialDataStartIndex, partialDataEndIndex);
    newData.set(rowData, startIndex);
  }
  return {
    data: newData,
    width: targetImageData.width,
    height: targetImageData.height
  };
}

export function getPartialImageData(imageData: ImageDataWrapper, bounds: DrawBounds): ImageDataWrapper {
  const newData = new Uint8ClampedArray(bounds.height * bounds.width * 4);
  for (let i = bounds.minY; i < bounds.maxY; i++) {
    const yOffset = i * imageData.width * 4;
    const xStartOffset = bounds.minX * 4;
    const xEndOffset = xStartOffset + bounds.width * 4;
    const startIndex = yOffset + xStartOffset;
    const endIndex = yOffset + xEndOffset;
    const rowData = imageData.data.slice(startIndex, endIndex);
    const targetIndex = (i - bounds.minY) * bounds.width * 4;
    newData.set(rowData, targetIndex);
  }
  return {
    data: newData,
    width: bounds.width,
    height: bounds.height
  };
}

export function drawTarget(imageData: ImageData, params: DrawParams, lastParams: DrawParams): ImageData {
  const position = params.position;
  const lastPosition = lastParams.position;
  const distance = distanceBetween(lastPosition, position);
  const angle = angleBetween(lastPosition, position);

  initCanvas(bufferCanvas, imageData.width, imageData.height, 
             new ImageData(imageData.width, imageData.height));
  const color = params.color;
  const r = color.r;
  const g = color.g;
  const b = color.b;
  const a = 1;
  const startColor = `rgba(${r},${g},${b},${a})`;  
  bufferContext.fillStyle = startColor;
  bufferContext.fillRect(params.position.x - params.size / 2, params.position.y - params.size / 2, 
                         params.size, params.size);

  return getAllImageData(bufferContext);
}

export function drawGradients(imageData: ImageData, params: DrawParams, lastParams: DrawParams): ImageData {
  const position = params.position;
  const lastPosition = lastParams.position;
  const distance = distanceBetween(lastPosition, position);
  const angle = angleBetween(lastPosition, position);

  initCanvas(bufferCanvas, imageData.width, imageData.height, 
             new ImageData(imageData.data, imageData.width, imageData.height));

  for (let i = 0; i < distance; i += 1) {
    const x = lastPosition.x + (Math.sin(angle) * i);
    const y = lastPosition.y + (Math.cos(angle) * i);
    const ratio = i / distance;
    setGlobalParams(bufferContext, params, lastParams, ratio);    
    bufferContext.globalAlpha = 1;
    const size = lerp(lastParams.size, params.size, ratio);
    const opacity = lerp(lastParams.opacity, params.opacity, ratio);
    const color = params.color;
    const r = color.r;
    const g = color.g;
    const b = color.b;
    const a = opacity;
    const startColor = `rgba(${r},${g},${b},${a})`;  
    const midColor = `rgba(${r},${g},${b},${a * .5})`;  
    const endColor = `rgba(${r},${g},${b},0)`;  
    var gradient = bufferContext.createRadialGradient(x, y, size / 4, x, y, size / 2);    
    
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(0.5, midColor);
    gradient.addColorStop(1, endColor);
    bufferContext.fillStyle = gradient;
    bufferContext.fillRect(x - params.size / 2, y - params.size / 2, size, size);
  }

  return getAllImageData(bufferContext);
}

export function midPointBetween(p1: DrawPosition, p2: DrawPosition) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  };
}

export function drawLines(imageData: ImageData, params: DrawParams, lastParams: DrawParams): ImageData {
  initCanvas(bufferCanvas, imageData.width, imageData.height, imageData);
  const color = params.color;
  const context = bufferContext;
  context.lineWidth = params.size;
  context.lineJoin = context.lineCap = 'round';  
  context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${(color.a ? color.a : 1)}`;
  drawLineSegments(context, 1, params, lastParams);
  return getAllImageData(context);
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
    const ratio = z / distance;
    setGlobalParams(bufferContext, params, lastParams, ratio);    
    const x = start.x + (Math.sin(angle) * z);
    const y = start.y + (Math.cos(angle) * z);
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
    context.stroke();
    lastX = x;
    lastY = y;
  }
}

export async function getImage(imageData: ImageData): Promise<HTMLImageElement> {
  initCanvas(patternCanvas, imageData.width, imageData.height, imageData);
  const brushImage = new Image();  
  return new Promise<HTMLImageElement>((resolve) => {
    brushImage.onload = () => {
      resolve(brushImage);
    };
    brushImage.src = patternCanvas.toDataURL();
  });
}

export function getImageData(image: HTMLImageElement): ImageData {
  if (!image.complete || image.naturalWidth === 0) {
    throw new Error('Image is not loaded.');
  }  
  initCanvas(patternCanvas, image.width, image.height);
  patternContext.drawImage(image, 0, 0);
  return getAllImageData(patternContext);
}

export function getPatternCanvas(image: HTMLImageElement, patternScale: number, jitter: number): HTMLCanvasElement {
  const targetHeight = (Math.random() * jitter) + patternScale * image.width;
  const targetWidth = (Math.random() * jitter) + patternScale * image.height;
  initCanvas(patternCanvas, targetWidth, targetHeight);
  patternContext.drawImage(image, 0, 0, targetWidth, targetHeight);
  return patternCanvas;
}

export function drawFromPattern(imageData: ImageData, 
                                params: DrawParams, lastParams: DrawParams): ImageData {
  const context = bufferContext;
  initCanvas(bufferCanvas, imageData.width, imageData.height, imageData);
  if (!params.tool.grainImage) {
    throw new Error('No grain image found for tool!');
  }
  const grainScale = params.tool.grainScale ? params.tool.grainScale : 1;
  const grainImage = params.tool.grainImage;
  const pattern = context.createPattern(getPatternCanvas(grainImage, grainScale, 10), 'repeat');
  context.lineWidth = params.size;
  context.strokeStyle = pattern;
  context.lineJoin = context.lineCap = 'round';  
  drawLineSegments(context, params.size / 2, params, lastParams);
  return bufferContext.getImageData(0, 0, imageData.width, imageData.height);
}