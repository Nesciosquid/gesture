import { ReduxAction } from '../actions/index';
import { actionTypes } from '../actions/tools';
import { ToolOptions } from '../types/tools';
import defaultTools from '../tools/defaultTools/index';
import { RGBColor } from 'react-color';
import Tool from '../types/tools/Tool';

export interface ToolsState {
  pressure: {
    force: number;
    event: any; //tslint:disable-line
  };
  color: RGBColor;
  tools: {
    selected?: Tool,
    options: ToolOptions
  };
  lastHammerAction?: {
    event?: HammerInput,
    actionType: string
  };
}

export const DefaultToolsState: ToolsState = {
  pressure: {
    force: 0,
    event: undefined
  },
  tools: {
    options: defaultTools
  },
  color: {
    r: 20,
    g: 20,
    b: 20,
  },
  lastHammerAction: {
    actionType: 'setup',
  }
};

function logHammerAction(state: ToolsState, lastHammerAction: { actionType: string, event: HammerInput}): ToolsState {
  return {
    ...state, lastHammerAction
  };
}

function setColor(state: ToolsState, color: RGBColor): ToolsState {
  return { ...state, color };
}

function setSelectedTool(state: ToolsState, tool: Tool): ToolsState {
  const tools = { ...state.tools, selected: tool };
  return { ...state, tools };
}

function changePressure(state: ToolsState, payload: { force: number, event: Event }): ToolsState {
  return { ...state, pressure: payload };
}

export default function(state: ToolsState = DefaultToolsState, {type, payload}: ReduxAction): ToolsState {
  switch (type) {
      case (actionTypes.changePressure): {
          return changePressure(state, payload);
      }
      case (actionTypes.setSelectedTool): {
        return setSelectedTool(state, payload);
      }
      case (actionTypes.setColor): {
        return setColor(state, payload);
      }
      case (actionTypes.logHammerAction): {
        return logHammerAction(state, payload);
      }
      default: {
        return state;
      }
  }
}