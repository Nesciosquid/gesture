import Tool from '../../types/tools/Tool';
import { ToolType } from '../../types/tools/index';

const softEraser: Tool = {
  name: 'soft eraser',
  id: 'soft eraser',
  type: ToolType.GRADIENTS,
  maxSizeRatio: 1,
  minSizeRatio: .2,
  maxOpacityRatio: 1,
  minOpacityRatio: .2,
  currentOpacity: 1,
  currentSize: 10,
  erase: true
};

export default softEraser;