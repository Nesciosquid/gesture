import { DrawParams, DrawPosition } from '../types/canvas';
import { RGBColor } from 'react-color';

export type ToolDrawCallback = (context: CanvasRenderingContext2D, points: DrawParams[], 
                                start?: number, end?: number) => void;

export enum ToolType {
  CURVES,
  IMAGE,
  PATTERN,
  LINES,
  GRADIENTS,
  TARGET
}

export interface Tool {
  getId: () => string;
  getType: () => ToolType;
  getName: () => string;
  getMaxSizeRatio: () => number;
  getMinSizeRatio: () => number;
  getMaxOpacityRatio: () => number;
  getMinOpacityRatio: () => number;

  getOpacity: () => number;
  getSize: () => number;

  getModifiedOpacity: (params: DrawParams) => number;
  getModifiedSize: (params: DrawParams) => number;

  shouldErase: () => boolean;
  onDraw: ToolDrawCallback;
}

export interface StrokeHistoryPoint {
  measured: DrawParams;
  predicted: DrawParams;
}

export interface ToolConfig {
  name: string;
  toolType: ToolType;
  maxSizeRatio: number;
  minSizeRatio: number;
  maxOpacityRatio: number;
  minOpacityRatio: number;
  shouldErase: boolean;
}