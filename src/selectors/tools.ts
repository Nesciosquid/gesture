import { ReduxState } from '../reducers/index';
import { Tool } from '../tools/Tool';
import * as Pressure from 'pressure';
import { RGBColor } from 'react-color';
import * as _ from 'lodash';

export function getToolOptions(state: ReduxState): Tool[] {
  return state.tools.tools.options;
}

export function isToolSelected(state: ReduxState, tool: Tool): boolean {
  return getSelectedTool(state) === tool;
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

export function getCurrentLayer(state: ReduxState): number {
  return state.tools.currentLayer;
}

export function getSelectedTool(state: ReduxState): Tool | undefined {
  return state.tools.tools.selected;
}

export function getLastHammerAction(state: ReduxState) {
  return state.tools.lastHammerAction;
}