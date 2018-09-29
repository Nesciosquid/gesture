import * as React from 'react';
import { connect } from 'react-redux';
import { setImageData, setBufferCanvas, setCanvas } from '../../actions/canvas';
import { ReduxState } from '../../reducers/index';
import { getImageData, getDirtyBounds } from '../../selectors/canvas';
import { getTransformMatrix } from '../../selectors/canvas';
import { initCanvas, DrawBounds, getPartialImageData, redrawSourceOntoTarget, getColorData, drawColorOntoTarget } from '../../utils/canvas';
import { TransformMatrix } from '../../utils/transform';
import ConnectedDrawingActionWrapper from './ConnectedDrawingActionWrapper';
import ConnectedTransformActionWrapper from './ConnectedTransformActionWrapper';
import { stopLog } from '../../actions/performance';
import { RGBColor } from 'react-color';

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
    // const { sourceCanvas, transformMatrix } = this.props;
    // this.redrawCanvas(sourceCanvas, transformMatrix); 
    // this.blankCanvas();
    this.initCanvas();
    this.redrawCanvas(this.props.sourceCanvas, this.props.transformMatrix);
    // this.colorCanvas();
  }

  initCanvas = () => {
    if (this.canvas) {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    }
  }
  
  redrawCanvas = (sourceCanvas: HTMLCanvasElement, matrix: TransformMatrix) => {
    if (this.canvas) {
      redrawSourceOntoTarget(this.canvas, sourceCanvas, matrix);      
    }
  }

  render() {
    this.redrawCanvas(this.props.sourceCanvas, this.props.transformMatrix);
    // this.colorCanvas();
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
