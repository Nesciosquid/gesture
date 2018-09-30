import { Tool, ToolConfig, ToolType } from './Tool';
import BasicTool from './BasicTool';
import lerp from 'lerp';
import { DrawParams, DrawPosition } from '../types/canvas';
import { drawLinesInContext } from '../utils/canvas';
import { RGBColor } from 'react-color';

export default class LineTool extends BasicTool implements Tool {
  onDraw = (context: CanvasRenderingContext2D, params: DrawParams, lastParams: DrawParams) => {
    drawLinesInContext(context, this, params, lastParams);
  }

  getType = () => ToolType.LINES;

  getDrawParams = (position: DrawPosition, color: RGBColor, pressure: number) => {
    return {
      tool: this,
      position,
      color,
      size: this.getModifiedSize(pressure),
      opacity: this.getModifiedOpacity(pressure)
    };
  }
}

export interface LineToolConfig extends ToolConfig {
  toolType: ToolType.LINES;
}