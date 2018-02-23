import { ToolType } from '../../types/tools/index';
import Tool from '../../types/tools/Tool';
const pencilGrainSource = require('./pencilPattern.png');

const pencilGrainImage = new Image();
pencilGrainImage.src = pencilGrainSource;

const pencil: Tool = {
  name: 'pencil',
  id: 'pencil',
  type: ToolType.PATTERN,
  grainSource: pencilGrainImage, 
  grainScale: .25,
  maxSizeRatio: 1,
  minSizeRatio: .2,
  maxOpacityRatio: 1,
  minOpacityRatio: .2,
  currentOpacity: 1,
  currentSize: 10,
  erase: false
};

export default pencil;