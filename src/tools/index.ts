import { ToolType, Tool, ToolConfig } from './Tool';
import GradientTool, { GradientToolConfig } from './GradientTool';
import LineTool, { LineToolConfig } from './LineTool';
import PatternTool, { PatternToolConfig } from './PatternTool';

export const buildTool = (config: ToolConfig) => {
  switch (config.toolType) {
    case(ToolType.LINES): {
      return new LineTool(config as LineToolConfig);
    }
    case(ToolType.GRADIENTS): {
      return new GradientTool(config as GradientToolConfig);
    }
    case(ToolType.PATTERN): {
      return new PatternTool(config as PatternToolConfig);
    }
    default: {
      return null;
    }
  }
};