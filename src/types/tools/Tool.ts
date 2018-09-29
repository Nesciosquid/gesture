import { ToolType } from './index';

export default interface Tool {
  id: string;
  type: ToolType;
  name: string;
  maxSizeRatio: number;
  minSizeRatio: number;
  maxOpacityRatio: number;
  minOpacityRatio: number;
  currentOpacity: number;
  currentSize: number;
  erase: boolean;
  
  // only used for pattern brushes
  grainScale?: number;
  grainSource?: HTMLImageElement;
  grainImage?: HTMLImageElement;
}