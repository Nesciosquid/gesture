import { ReduxState } from '../reducers/index';
import Tool from '../types/tools/Tool';
import * as Pressure from 'pressure';
import { RGBColor } from 'react-color';
import * as _ from 'lodash';

export function getPressure(state: ReduxState): number {
  return state.tools.pressure.force;
}

export function getToolOptions(state: ReduxState): {[id: string]: Tool} {
  return state.tools.tools.options;
}

export function isToolSelected(state: ReduxState, tool: Tool): boolean {
  return _.get(getSelectedTool(state), 'id') === tool.id;
}

export function getColor(state: ReduxState): RGBColor {
  return state.tools.color;
}

export function getToolById(state: ReduxState, toolId: string): Tool {
  const tools = state.tools.tools.options;  
  const targetTool = tools[toolId];
  if (!targetTool) { 
    throw new Error('Cannot get tool; no tool found with ID: ' + toolId);
  }
  return targetTool;
}

export function getSelectedTool(state: ReduxState): Tool | undefined {
  return state.tools.tools.selected;
}

export function getCurrentOpacity(state: ReduxState, tool: Tool): number {
  const pressure = state.tools.pressure.force;
  const opacityRatio = Pressure.map(pressure, 0, 1, tool.minOpacityRatio, tool.maxOpacityRatio);
  return tool.currentOpacity * opacityRatio;
}

export function getCurrentSize(state: ReduxState, tool: Tool): number {
  const pressure = state.tools.pressure.force;
  const sizeRatio = Pressure.map(pressure, 0, 1, tool.minSizeRatio, tool.maxSizeRatio);
  return tool.currentSize * sizeRatio;
}

export function getLastHammerAction(state: ReduxState) {
  return state.tools.lastHammerAction;
}