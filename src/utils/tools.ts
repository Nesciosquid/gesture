import Tool from '../types/tools/Tool';
import * as Pressure from 'pressure';
import { DrawParams, DrawPosition } from '../types/canvas';
import { RGBColor } from 'react-color';

export function getSize(tool: Tool, pressure: number) {
  const sizeRatio = Pressure.map(pressure, 0, 1, tool.minSizeRatio, tool.maxSizeRatio);
  return tool.currentSize * sizeRatio;
}

export function getOpacity(tool: Tool, pressure: number) {
  const opacityRatio = Pressure.map(pressure, 0, 1, tool.minOpacityRatio, tool.maxOpacityRatio);
  return tool.currentOpacity * opacityRatio;
}

export function getDrawParams(tool: Tool, position: DrawPosition, color: RGBColor, pressure: number): DrawParams {
  return {
    tool,
    position,
    color,
    size: getSize(tool, pressure),
    opacity: getOpacity(tool, pressure),
  };
}