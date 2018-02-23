import Tool from '../../types/tools/Tool';
import { RGBColor } from 'react-color';

export interface DrawParams {
  tool: Tool;
  position: DrawPosition;
  opacity: number;
  size: number;
  color: RGBColor;
}

export interface DrawPosition {
  x: number;
  y: number;
}