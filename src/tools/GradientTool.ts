import { Tool, ToolConfig, ToolType } from './Tool';
import BasicTool from './BasicTool';
import { DrawParams, DrawPosition } from '../types/canvas';
import { drawGradientsInContext } from '../utils/canvas';
import { RGBColor } from 'react-color';

export default class GradientTool extends BasicTool implements Tool {
  onDraw = (context: CanvasRenderingContext2D, params: DrawParams, lastParams: DrawParams) => {
    drawGradientsInContext(context, this, params, lastParams);
  }

  getType = () => ToolType.GRADIENTS;

  getDrawParams = (position: DrawPosition, color: RGBColor, pressure: number) => {
    return {
      position,
      color,
      size: this.getModifiedSize(pressure),
      opacity: this.getModifiedOpacity(pressure)
    };
  }
}

export interface GradientToolConfig extends ToolConfig {
  toolType: ToolType.GRADIENTS;
}