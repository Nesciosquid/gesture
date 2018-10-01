import { Tool, ToolConfig, ToolType } from './Tool';
import BasicTool from './BasicTool';
import lerp from 'lerp';
import { DrawParams, DrawPosition } from '../types/canvas';
import { drawLinesInContext } from '../utils/canvas';
import { RGBColor } from 'react-color';

export default class LineTool extends BasicTool implements Tool {
  onDraw = (context: CanvasRenderingContext2D, points: DrawParams[], start?: number, end?: number) => {
    drawLinesInContext(context, this, points, start, end);
  }

  getType = () => ToolType.LINES;
}

export interface LineToolConfig extends ToolConfig {
  toolType: ToolType.LINES;
}