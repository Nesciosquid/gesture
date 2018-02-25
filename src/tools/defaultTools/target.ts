import Tool from '../../types/tools/Tool';
import { ToolType } from '../../types/tools/index';

const transPen: Tool = {
  name: 'target',
  id: 'target',
  type: ToolType.TARGET,
  maxSizeRatio: 1,
  minSizeRatio: .8,
  maxOpacityRatio: 1,
  minOpacityRatio: 1,
  currentOpacity: .3,
  currentSize: 20,
  erase: false
};

export default transPen;