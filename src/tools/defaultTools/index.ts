import pencil from './basicPencil';
import pen from './basicPen';
import softEraser from './softEraser';
import transPen from './transPen';
import { ToolConfig } from '../Tool';

const defaultToolConfigs: ToolConfig[] = [
  pencil,
  pen,
  transPen,
  softEraser 
];

export default defaultToolConfigs;