import { ToolConfig, ToolType, Tool } from './Tool';
import LineTool from './LineTool';
import { DrawParams, DrawPosition } from '../types/canvas';
import { drawFromPatternInContext } from '../utils/canvas';
import { RGBColor } from 'react-color';

export default class PatternTool extends LineTool {
  private patternConfig: PatternToolConfig;
  private patternImage: HTMLImageElement;
  constructor(config: PatternToolConfig, opacity: number = 1, size: number = 10) {
    super(config, opacity, size);
    this.patternConfig = config;
    this.patternImage = config.patternSource;
  }
  onDraw = (context: CanvasRenderingContext2D, points: DrawParams[], start?: number, end?: number) => {
    drawFromPatternInContext(context, this, points, start, end);
  }

  getPatternSource = () => this.patternConfig.patternSource;
  getPatternScale = () => this.patternConfig.patternScale;

  setPatternImage = (image: HTMLImageElement) => this.patternImage = image;
  getPatternImage = () => this.patternImage;

  getType = () => ToolType.PATTERN;
}

export interface PatternToolConfig extends ToolConfig {
  patternScale: number;
  patternSource: HTMLImageElement;
  toolType: ToolType.PATTERN;
}