import { Tool, ToolConfig } from './Tool';
import lerp from 'lerp';
import { RGBColor } from 'react-color';
import * as uuid from 'uuid/v4';
import { DrawPosition, DrawParams } from '../types/canvas';

export default abstract class BasicTool implements Partial<Tool> {
  private config: ToolConfig;
  private id: string;
  private opacity: number;
  private size: number;

  constructor(config: ToolConfig, opacity: number = 1, size: number = 10) {
    this.config = config;
    this.opacity = opacity;
    this.size = size;
    this.id = uuid();
  }

  getMaxOpacityRatio = () => this.config.maxOpacityRatio;
  getMinOpacityRatio = () => this.config.minOpacityRatio;
  getMaxSizeRatio = () => this.config.maxSizeRatio;
  getMinSizeRatio = () => this.config.minSizeRatio;
  
  getName = () => this.config.name;
  getId = () => this.id;

  setOpacity = (opacity: number) => this.opacity = opacity;
  setSize = (size: number) => this.size = size;

  getSize = () => this.size;
  getOpacity = () => this.opacity;

  shouldErase = () => this.config.shouldErase;

  getModifiedOpacity = (params: DrawParams) => {
    return this.getOpacity() * 
      lerp(this.getMinOpacityRatio(), this.getMaxOpacityRatio(), this.sanitize(params.pressure));
  }

  getModifiedSize = (params: DrawParams) => {
    return this.getSize() * lerp(this.getMinSizeRatio(), this.getMaxSizeRatio(),  this.sanitize(params.pressure));
  }

  private sanitize(fraction?: number) {
    if (fraction === undefined) {
      return .5;
    } else {
      return fraction;
    }
  }
}