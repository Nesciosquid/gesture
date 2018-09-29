import * as React from 'react';
import { connect } from 'react-redux';
import { TouchEvent, MouseEvent, ReactChild } from 'react';
import { startDrawing, stopDrawing, drawWithCurrentTool } from '../../actions/viewport';
import { DrawPosition } from '../../types/canvas/index';
import { ReduxState } from '../../reducers/index';
import { TransformMatrix, Transform } from '../../utils/transform';
import * as Pressure from 'pressure';
import { getTransformMatrix } from '../../selectors/canvas';
import { changePressure } from '../../actions/tools';
import * as _ from 'lodash';
import DrawingActionWrapper from './DrawingActionWrapper';

// const getPosition = (event: MouseEvent<HTMLDataElement> | TouchEvent<HTMLDivElement>) => {
//   return { x: event. - 220, y: }
// }

const mapStateToProps = (state: ReduxState) => ({
  transformMatrix: getTransformMatrix(state),
});

const mapDispatchToProps = (dispatch: Function) => ({
  draw: (position: DrawPosition) => {
    dispatch(drawWithCurrentTool(position));
  },
  stopDrawing: () => { 
    dispatch(stopDrawing());
  },
  startDrawing: (position: DrawPosition) => {
    dispatch(startDrawing(position));
  },
  changePressure: (force: number, event: PointerEvent | null) => {
    dispatch(changePressure(force, event));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawingActionWrapper);