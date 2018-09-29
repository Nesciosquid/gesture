import Tool from '../../types/tools/Tool';
import { ToolType } from '../../types/tools/index';

const pen: Tool = {
  name: 'pen',
  id: 'pen',
  type: ToolType.LINES,
  maxSizeRatio: 1,
  minSizeRatio: .2,
  maxOpacityRatio: 1,
  minOpacityRatio: 1,
  currentOpacity: 1,
  currentSize: 10,
  erase: false
};

export default pen;