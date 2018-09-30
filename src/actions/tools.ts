import { RGBColor } from 'react-color';
import { ReduxState } from '../reducers/index';
import { updateGrainImage } from '../utils/canvas';
import { getSelectedTool, getColor } from '../selectors/tools';
import { ToolType, Tool } from '../tools/Tool';
import PatternTool from '../tools/PatternTool';

export const actionTypes = {
    changePressure: 'TOOLS//CHANGE_PRESSURE',
    setSelectedTool: 'TOOLS//SET_SELECTED_TOOL',
    setToolSize: 'TOOLS//SET_TOOL_SIZE',
    setToolOpacity: 'TOOLS//SET_TOOL_OPACITY',
    setColor: 'TOOLS//SET_COLOR',
    logHammerAction: 'TOOLS//LOG_HAMMER_ACTION',
    setLayer: 'TOOLS//SET_LAYER'
};

export function setCurrentLayer(layer: number) {
  return ({
    type: actionTypes.setLayer,
    payload: layer
  });
}

export function __setColor(color: RGBColor) {
  return ({
    type: actionTypes.setColor,
    payload: color
  });
}

export function logHammerAction(actionType: string, event: HammerInput) {
  return ({
    type: actionTypes.logHammerAction,
    payload: {
      actionType,
      event
    }
  });
}

export function setColor(color: RGBColor) {
  return async (dispatch: Function, getState: () => ReduxState) => {
    const state = getState();
    const tool = getSelectedTool(state);
    if (tool && tool.getType() === ToolType.PATTERN) {
      await updateGrainImage(tool as PatternTool, color);
    } 
    dispatch(__setColor(color));     
  };
}

export function changePressure(force: number, event: any) { //tslint:disable-line
    return ({
        type: actionTypes.changePressure,
        payload: {
          force,
          event
        }
    });
}

export function __setSelectedTool(tool: Tool) {
  return ({
    type: actionTypes.setSelectedTool,
    payload: tool
  });
}

export function setSelectedTool(tool: Tool) {
  return async (dispatch: Function, getState: () => ReduxState) => {
    const state = getState();
    if (tool.getType() === ToolType.PATTERN) {
      const color = getColor(state);      
      await updateGrainImage(tool as PatternTool, color);
    }
    dispatch(__setSelectedTool(tool));      
  };
}

export function setToolSize(toolId: string, size: number) {
  return ({
    type: actionTypes.setToolSize,
    payload: {
      toolId,
      size
    }
  });
}

export function setToolOpacity(toolId: string, opacity: number) {
  return ({
    type: actionTypes.setToolOpacity,
    payload: {
      toolId, 
      opacity
    }
  });
}