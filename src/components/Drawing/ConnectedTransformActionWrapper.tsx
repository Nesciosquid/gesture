import * as React from 'react';
import { connect } from 'react-redux';
import { ReactChild } from 'react';
import { drawWithCurrentTool,
  startDrawing, stopDrawing, storeGestureParams, clearStoredGestureParams } from '../../actions/viewport';
import { setTransformMatrix } from '../../actions/canvas';
// import { DrawPosition } from '../../types/canvas/index';
import { ReduxState } from '../../reducers/index';
import { TransformMatrix, Transform } from '../../utils/transform';
import { getTransformMatrix } from '../../selectors/canvas';
import { getStoredGestureParams } from '../../selectors/viewport';
import * as Hammer from 'hammerjs';
import { logHammerAction } from '../../actions/tools';
import { DrawPosition } from '../../types/canvas/index';
import { getSelectedTool } from '../../selectors/tools';
import Tool from '../../types/tools/Tool';
import { ToolType } from '../../types/tools/index';
import { GestureParams } from '../../reducers/viewport';
import TransformActionWrapper from './TransformActionWrapper';

const mapStateToProps = (state: ReduxState) => ({
  transformMatrix: getTransformMatrix(state),
  storedGestureParams: getStoredGestureParams(state),
  tool: getSelectedTool(state)
});

const mapDispatchToProps = (dispatch: Function) => ({
  storeGestureParams: (params: GestureParams) => {
    dispatch(storeGestureParams(params));
  },
  clearGestureParams: () => {
    dispatch(clearStoredGestureParams());
  },
  startDrawing: (position: DrawPosition) => {
    dispatch(startDrawing(position));
  },
  stopDrawing: () => {
    dispatch(stopDrawing);
  },
  draw: (position: DrawPosition) => {
    dispatch(drawWithCurrentTool(position));
  },
  setTransformMatrix: (matrix: TransformMatrix) => {
    dispatch(setTransformMatrix(matrix));
  },
  logHammerAction: (type: string, event: HammerInput) => {
    dispatch(logHammerAction(type, event));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TransformActionWrapper);