import { Tool } from '../../tools/Tool';
import { RGBColor } from 'react-color';

export interface DrawParams {
  position: DrawPosition;
  pressure: number;
  color: RGBColor;
}

export interface DrawPosition {
  x: number;
  y: number;
}