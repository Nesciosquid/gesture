import * as React from 'react';
import { connect } from 'react-redux';
import { setImageData, setBufferCanvas, setCanvas } from '../../actions/canvas';
import { ReduxState } from '../../reducers/index';
import { getImageData, getDirtyBounds } from '../../selectors/canvas';
import { getTransformMatrix } from '../../selectors/canvas';
import { initCanvas, DrawBounds, getPartialImageData, redrawSourceOntoTarget } from '../../utils/canvas';
import { TransformMatrix } from '../../utils/transform';
import ConnectedDrawingActionWrapper from './ConnectedDrawingActionWrapper';
import ConnectedTransformActionWrapper from './ConnectedTransformActionWrapper';
import { stopLog } from '../../actions/performance';

interface DrawingCanvasProps {
  transformMatrix: TransformMatrix;
  sourceCanvas: HTMLCanvasElement;
}

export default class DrawingCanvas extends React.Component<DrawingCanvasProps> {
  canvas: HTMLCanvasElement | null;
  constructor(props: DrawingCanvasProps) {
    super(props);
  }
  componentDidMount() {
    const { sourceCanvas, transformMatrix } = this.props;
    this.redrawCanvas(sourceCanvas, transformMatrix); 
  }
  componentWillReceiveProps(nextProps: DrawingCanvasProps) {
    const { sourceCanvas, transformMatrix } = nextProps;
    this.redrawCanvas(sourceCanvas, transformMatrix);
  }
  redrawCanvas = (sourceCanvas: HTMLCanvasElement, matrix: TransformMatrix) => {
    if (this.canvas) {
      redrawSourceOntoTarget(this.canvas, sourceCanvas, matrix);      
    }
  }
  render() {
    return (
      <ConnectedTransformActionWrapper>
        <ConnectedDrawingActionWrapper>
          <canvas 
            className="drawing-canvas"
            ref={(canvas) => { this.canvas = canvas; }} 
            style={{ flexGrow: 1}}
          />
        </ConnectedDrawingActionWrapper>
      </ConnectedTransformActionWrapper>
    );
  }
}
