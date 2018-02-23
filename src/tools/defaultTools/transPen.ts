import Tool from '../../types/tools/Tool';
import { ToolType } from '../../types/tools/index';

const transPen: Tool = {
  name: 'transPen',
  id: 'transPen',
  type: ToolType.LINES,
  maxSizeRatio: 1,
  minSizeRatio: .1,
  maxOpacityRatio: 1,
  minOpacityRatio: 0,
  currentOpacity: .3,
  currentSize: 10,
  erase: false
};

export default transPen;