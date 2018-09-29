import Tool from '../../types/tools/Tool';
import { ToolType } from '../../types/tools/index';

const softEraser: Tool = {
  name: 'soft airbrush',
  id: 'soft airbrush',
  type: ToolType.GRADIENTS,
  maxSizeRatio: 1,
  minSizeRatio: .8,
  maxOpacityRatio: .5,
  minOpacityRatio: .01,
  currentOpacity: 1,
  currentSize: 30,
  erase: false
};

export default softEraser;