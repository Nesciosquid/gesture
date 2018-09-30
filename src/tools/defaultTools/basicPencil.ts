import { PatternToolConfig } from '../PatternTool';
import { ToolType } from '../Tool';
const pencilGrainSource = require('./pencilPattern.png');

const pencilGrainImage = new Image();
pencilGrainImage.src = pencilGrainSource;

const examplePencil: PatternToolConfig = {
  name: 'pencil',
  toolType: ToolType.PATTERN,
  maxSizeRatio: 1,
  minSizeRatio: .2,
  maxOpacityRatio: 1,
  minOpacityRatio: .2,
  patternSource: pencilGrainImage, 
  patternScale: .25,
  shouldErase: false
};

export default examplePencil;