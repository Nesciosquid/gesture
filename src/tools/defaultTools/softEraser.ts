import { GradientToolConfig } from '../GradientTool';
import { ToolType } from '../Tool';

export const softEraser: GradientToolConfig = {
  name: 'soft eraser',
  toolType: ToolType.GRADIENTS,
  maxSizeRatio: 1,
  minSizeRatio: 1,
  maxOpacityRatio: 1,
  minOpacityRatio: 0,
  shouldErase: true
};

export default softEraser;