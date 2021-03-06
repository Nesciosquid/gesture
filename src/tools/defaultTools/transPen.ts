import { LineToolConfig } from '../LineTool';
import { ToolType } from '../Tool';

export const transPen: LineToolConfig = {
  name: 'transPen',
  toolType: ToolType.LINES,
  maxSizeRatio: 1,
  minSizeRatio: .1,
  maxOpacityRatio: 1,
  minOpacityRatio: 0,
  shouldErase: false
};

export default transPen;