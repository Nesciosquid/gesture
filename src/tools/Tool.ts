import { DrawParams, DrawPosition } from '../types/canvas';
import { RGBColor } from 'react-color';

export type ToolDrawCallback = (context: CanvasRenderingContext2D, params: DrawParams, lastParams: DrawParams) => void;

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

  getModifiedOpacity: (fraction: number) => number;
  getModifiedSize: (fraction: number) => number;
  getDrawParams: (position: DrawPosition, color: RGBColor, pressure: number) => DrawParams;

  shouldErase: () => boolean;
  onDraw: ToolDrawCallback;
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