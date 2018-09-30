import { LineToolConfig } from '../LineTool';
import { ToolType } from '../Tool';

export const simplePen: LineToolConfig = {
  name: 'pen',
  toolType: ToolType.LINES,
  maxSizeRatio: 1,
  minSizeRatio: .2,
  maxOpacityRatio: 1,
  minOpacityRatio: 1,
  shouldErase: false
};

export default simplePen;