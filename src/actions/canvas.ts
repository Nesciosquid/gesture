import { ReduxState } from '../reducers/index';
import * as Pressure from 'pressure';
import { DrawParams, ToolType } from '../reducers/canvas';
import { RGBColor } from 'react-color';

export const actionTypes = {
  setContext: 'CANVAS//SET_CONTEXT',
  drawRect: 'CANVAS//DRAW_RECT',
  startDrawing: 'CANVAS//START_DRAWING',
  stopDrawing: 'CANVAS//STOP_DRAWING',
  draw: 'CANVAS//DRAW',
  setDrawColor: 'CANVAS//SET_DRAW_COLOR',
  setSourceImage: 'CANVAS//SET_SOURCE_IMAGE',
  setPatternImage: 'CANVAS//SET_PATTERN_IMAGE',
  setToolType: 'CANVAS//SET_TOOL_TYPE'
};

export interface RectParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function setContext(ctx: CanvasRenderingContext2D) { //tslint:disable-line
  return ({
      type: actionTypes.setContext,
      payload: ctx
  });
}

export function drawRect(params: RectParams) {
  return ({
    type: actionTypes.drawRect,
    payload: params
  });
}

export function draw(params: DrawParams) {
  return ({
    type: actionTypes.draw,
    payload: params
  });
}

export function startDrawing(x: number, y: number) {
  return ({
    type: actionTypes.startDrawing,
    payload: { x, y }
  });
}

export function stopDrawing() {
  return ({
    type: actionTypes.stopDrawing
  });
}

export function setSourceImage(image: HTMLImageElement) {
  return ({
    type: actionTypes.setSourceImage,
    payload: image
  });
}

export function setDrawColor(color: RGBColor) {
  return ({
    type: actionTypes.setDrawColor,
    payload: color
  });
}

export function setPatternImage(image: HTMLImageElement) {
  return ({
    type: actionTypes.setPatternImage,
    payload: image
  });
}

export function setToolType(tool: ToolType) {
  return ({
    type: actionTypes.setToolType,
    payload: tool
  });
}

export function drawFromPressure(x: number, y: number, minSize: number, 
  maxSize: number, minOpacity: number, maxOpacity: number) {
  return (dispatch: Function, getState: () => ReduxState) => {
    const force = getState().pressure.change.force;
    const size = Pressure.map(force, 0, 1, minSize, maxSize);
    const opacity = Pressure.map(force, 0, 1, minOpacity, maxOpacity);
    dispatch(draw({
      position: { x, y },
      size,
      opacity
    }));
  };
}

export function drawRectFromPressure(x: number, y: number, minSize: number, maxSize: number) {
  return (dispatch: Function, getState: () => ReduxState) => {
    const force = getState().pressure.change.force;
    const size = Pressure.map(force, 0, 1, minSize, maxSize);
    if (force > 0) {
      dispatch({
        type: actionTypes.drawRect,
        payload: {
          width: size,
          height: size,
          x,
          y
        }
      });
    }
  };
}