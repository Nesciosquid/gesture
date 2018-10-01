import { Tool, ToolConfig, ToolType } from './Tool';
import BasicTool from './BasicTool';
import { DrawParams, DrawPosition } from '../types/canvas';
import { drawGradientsInContext } from '../utils/canvas';
import { RGBColor } from 'react-color';

export default class GradientTool extends BasicTool implements Tool {
  onDraw = (context: CanvasRenderingContext2D, points: DrawParams[], start?: number, end?: number) => {
    drawGradientsInContext(context, this, points, start, end);
  }

  getType = () => ToolType.GRADIENTS;
}

export interface GradientToolConfig extends ToolConfig {
  toolType: ToolType.GRADIENTS;
}