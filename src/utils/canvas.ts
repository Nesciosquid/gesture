import { RGBColor } from 'react-color';
import { DrawPosition, DrawParams } from '../types/canvas';
import { Tool } from '../tools/Tool';
import lerp from 'lerp';
import * as FileSaver from 'file-saver';
import * as _ from 'lodash';
import { TransformMatrix } from './transform';
import PatternTool from '../tools/PatternTool';
import LineTool from '../tools/LineTool';
import GradientTool from '../tools/GradientTool';
import { getCurvePoints } from 'cardinal-spline-js';

const bufferCanvas: HTMLCanvasElement = document.createElement('canvas');
const bufferContext = bufferCanvas.getContext('2d') as CanvasRenderingContext2D;
const patternCanvas: HTMLCanvasElement = document.createElement('canvas');
const patternContext = patternCanvas.getContext('2d') as CanvasRenderingContext2D;
const combineCanvas: HTMLCanvasElement = document.createElement('canvas');
const combineContext = combineCanvas.getContext('2d') as CanvasRenderingContext2D;

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

export async function updateGrainImage(tool: PatternTool, color: RGBColor) {
  if (!tool.getPatternSource()) {
    throw new Error('Tool does not have a grain pattern.');
  }
  const grainData = getImageData(tool.getPatternSource());
  const colorized = await colorizeImageData(grainData, color);
  const colorizedImage = await getImage(colorized);

  tool.setPatternImage(colorizedImage);
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

export function setGlobalParams(context: CanvasRenderingContext2D, tool: Tool, params: DrawParams, 
                                lastParams?: DrawParams, ratio?: number) {
  ratio = ratio !== undefined ? ratio : .5;
  let opacity, size;
  if (lastParams) {
    const lastOpacity = tool.getModifiedOpacity(lastParams);
    const newOpacity = tool.getModifiedOpacity(params);
    const lastSize = tool.getModifiedSize(lastParams);
    const newSize = tool.getModifiedSize(params);
    opacity = lerp(lastOpacity, newOpacity, ratio);
    size = lerp(lastSize, newSize, ratio);
  } else {
    opacity = tool.getModifiedOpacity(params);
    size = tool.getModifiedSize(params);
  }

  context.globalAlpha = opacity;
  context.lineWidth = size;
  if (tool.shouldErase()) {
    context.globalCompositeOperation = 'destination-out';
  } else {
    context.globalCompositeOperation = 'source-over';
  }
}

export function getColorData(color: RGBColor, width: number, height: number) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    const r = color.r;
    const g = color.g;
    const b = color.b;
    const a = 255;
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = a; 
  }
  return new ImageData(data, width, height);
}

export function putPartialImageData(targetImageData: ImageDataWrapper, partialData: ImageDataWrapper, 
                                    bounds: DrawBounds, targetArray?: Uint8ClampedArray): ImageDataWrapper {
  let newData: Uint8ClampedArray;
  if (targetArray) {
    newData = targetArray;
  } else {
    newData = targetImageData.data.slice();
  }
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

export function getFullBounds(imageData: ImageData) {
  return {
    minX: 0,
    minY: 0,
    maxX: imageData.width,
    maxY: imageData.height,
    width: imageData.width,
    height: imageData.height
  };
}

export function getPartialImageData(imageData: ImageDataWrapper, bounds: DrawBounds,
                                    targetArray?: Uint8ClampedArray): ImageDataWrapper {
  let newData: Uint8ClampedArray;
  if (targetArray) {
    newData = targetArray;
  } else {
    newData = new Uint8ClampedArray(bounds.height * bounds.width * 4);
  }
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

export function drawColorOntoTarget(targetCanvas: HTMLCanvasElement, color: RGBColor) {
  const context = targetCanvas.getContext('2d') as CanvasRenderingContext2D;
  if (context) {
    const bg = getColorData(color, targetCanvas.width, targetCanvas.height);
    context.putImageData(bg, 0, 0);
  }
}

export function clearCanvas(targetCanvas: HTMLCanvasElement) {
  const context = targetCanvas.getContext('2d') as CanvasRenderingContext2D;
  context.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
}

export function redrawSourcesOntoTarget(targetCanvas: HTMLCanvasElement, sourceCanvases: HTMLCanvasElement[],
                                        matrix: TransformMatrix) {
  if (sourceCanvases.length === 0) {
    throw new Error('No canvas to redraw.');
  }
  const firstCanvas = sourceCanvases[0];
  const context = targetCanvas.getContext('2d') as CanvasRenderingContext2D;
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, firstCanvas.width, firstCanvas.height);
  context.setTransform(matrix.scX, matrix.skX, matrix.skY, matrix.scY, matrix.tX, matrix.tY);
  sourceCanvases.forEach(canvas => {
    context.drawImage(canvas, 0, 0);
  });
}

export function redrawSourceOntoTarget(targetCanvas: HTMLCanvasElement, sourceCanvas: HTMLCanvasElement, 
                                       matrix: TransformMatrix ) {
  const context = targetCanvas.getContext('2d') as CanvasRenderingContext2D;
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);          
  context.setTransform(matrix.scX, matrix.skX, matrix.skY, matrix.scY, matrix.tX, matrix.tY);
  context.drawImage(sourceCanvas, 0, 0);
}

export function getLastParams(points: DrawParams[], index: number) {
  if (points.length === 0) {
    return null;
  }
  if ((index - 1) < 0) {
    return points[0];
  }
  return points[index - 1];
}

export function drawGradientsInContext(context: CanvasRenderingContext2D, tool: GradientTool, points: DrawParams[],
                                       start?: number, end?: number) { 
  start = start !== undefined ? start : 0;
  end = end !== undefined ? end : points.length;
  for (let index = start; index < end; index ++) {
    const params = points[index];
    const lastParams = getLastParams(points, index) as DrawParams;
    const position = params.position;
    const lastPosition = lastParams.position;
    const distance = distanceBetween(lastPosition, position);
    const angle = angleBetween(lastPosition, position);
    const lastSize = tool.getModifiedSize(lastParams);
    const newSize = tool.getModifiedSize(params);
    const lastOpacity = tool.getModifiedOpacity(lastParams);
    const newOpacity = tool.getModifiedOpacity(params);
  
    for (let i = 0; i < distance; i += 1) {
      const x = lastPosition.x + (Math.sin(angle) * i);
      const y = lastPosition.y + (Math.cos(angle) * i);
      const ratio = i / distance;
      setGlobalParams(context, tool, params, lastParams, ratio);    
      context.globalAlpha = 1;
      const size = lerp(lastSize, newSize, ratio);
      const opacity = lerp(lastOpacity, newOpacity, ratio);
      const color = params.color;
      const r = color.r;
      const g = color.g;
      const b = color.b;
      const a = opacity;
      const startColor = `rgba(${r},${g},${b},${a})`;  
      const midColor = `rgba(${r},${g},${b},${a * .5})`;  
      const endColor = `rgba(${r},${g},${b},0)`;  
      var gradient = context.createRadialGradient(x, y, size / 4, x, y, size / 2);    
      
      gradient.addColorStop(0, startColor);
      gradient.addColorStop(0.5, midColor);
      gradient.addColorStop(1, endColor);
      context.fillStyle = gradient;
      context.fillRect(x - newSize / 2, y - newSize / 2, size, size);
    }
  }
}

export function midPointBetween(p1: DrawPosition, p2: DrawPosition) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  };
}

export function drawLinesInContext(context: CanvasRenderingContext2D, tool: LineTool, points: DrawParams[],
                                   start?: number, end?: number) {
  if (points.length === 0 ) {
    return;
  }
  start = start !== undefined ? start : 0;
  end = end !== undefined ? end : points.length;
  const params = points[start];
  const color = params.color;
  context.lineJoin = context.lineCap = 'round'; 
  context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${(color.a ? color.a : 1)}`;
  drawLineSegments(context, 1, tool, points, start, end);
                                   }

export function computeCurveParams(points: DrawParams[], tension: number, segments: number): DrawParams[] {
  if (points.length === 0) {
    return points;
  }
  const pointsArray: number[] = [];
  points.forEach(point => {
    pointsArray.push(point.position.x);
    pointsArray.push(point.position.y);
  });
  const curvePoints = getCurvePoints(pointsArray, tension, segments);
  const newParams: DrawParams[] = [];
  for (let i = 0; i < curvePoints.length; i += 2) {
    const x = curvePoints[i];
    const y = curvePoints[i + 1];
    const position = { x, y };
    const pointNumber = Math.floor(i / 2);
    const startParamIndex = Math.floor(pointNumber / segments);
    const offset = pointNumber % segments;
    const ratio = offset / segments;
    const endParamIndex = startParamIndex + 1;
    const startParam = points[startParamIndex];
    const endParam = points[endParamIndex] || startParam;
    newParams.push({
      position: { x, y },
      pressure: lerp(startParam.pressure, endParam.pressure, ratio),
      color: startParam.color
    });
  }
  return newParams;
}

export function drawLineSegments(context: CanvasRenderingContext2D, minDistance: number, tool: LineTool,
                                 points: DrawParams[], start?: number, end?: number) {
  start = start !== undefined ? start : 0;
  end = end !== undefined ? end : points.length;
  const segments = 10;
  const tension = .4;
  const curveParams = computeCurveParams(points, tension, segments);
  const curveParamStart = start * segments;
  const curveParamEnd = Math.min(end * segments, curveParams.length);
  for (let index = curveParamStart; index < curveParamEnd; index ++) {
    const params = curveParams[index];
    const lastParams = curveParams[index - 1] || params;
    const startPosition = lastParams.position;
    const endPosition = params.position;
    
    setGlobalParams(context, tool, params);
    context.beginPath();
    context.moveTo(startPosition.x, startPosition.y);
    context.lineTo(endPosition.x, endPosition.y);
    context.stroke();
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

export function drawFromPatternInContext(context: CanvasRenderingContext2D, tool: PatternTool, points: DrawParams[],
                                         start?: number, end?: number) {
  if (points.length === 0) {
    return;
  }
  const params = points[0];
  const grainScale = tool.getPatternScale();
  const grainImage = tool.getPatternImage();
  const pattern = context.createPattern(getPatternCanvas(grainImage, grainScale, 10), 'repeat');
  const size = tool.getModifiedSize(params);
  context.lineWidth = size;
  context.strokeStyle = pattern;
  context.lineJoin = context.lineCap = 'round';  
  drawLineSegments(context, size / 4, tool, points, start, end);
}