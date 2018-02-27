import * as React from 'react';
import { connect } from 'react-redux';
import { setImageData } from '../../actions/canvas';
import { ReduxState } from '../../reducers/index';
import { getImageData } from '../../selectors/canvas';
import { getTransformMatrix } from '../../selectors/viewport';
import { initCanvas, DrawBounds, getPartialImageData } from '../../utils/canvas';
import { TransformMatrix } from '../../utils/transform';
import DrawingActionWrapper from './DrawingActionWrapper';
import TransformActionWrapper from './TransformActionWrapper';

interface DrawingCanvasProps {
  imageData: ImageData;
  transformMatrix: TransformMatrix;
}

class DrawingCanvas extends React.Component<DrawingCanvasProps> {
  canvas: HTMLCanvasElement | null;
  bufferCanvas: HTMLCanvasElement;
  constructor(props: DrawingCanvasProps) {
    super(props);
    this.bufferCanvas = document.createElement('canvas');
  }
  initCanvas() {
    if (this.canvas) {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    } else {
      throw new Error('No canvas found.');
    }
  }
  componentDidMount() {
    this.initCanvas();
    const { imageData, transformMatrix } = this.props;
    this.redrawCanvas(imageData, transformMatrix);
  }
  componentWillReceiveProps(nextProps: DrawingCanvasProps) {
    const { imageData, transformMatrix } = nextProps;
    this.redrawCanvas(imageData, transformMatrix);
  }
  redrawCanvas = async (imageData: ImageData, matrix: TransformMatrix) => {
    if (this.canvas && imageData) {
      const context = this.canvas.getContext('2d');
      if (context) {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);          
        context.setTransform(matrix.scX, matrix.skX, matrix.skY, matrix.scY, matrix.tX, matrix.tY);
        initCanvas(this.bufferCanvas, imageData.width, imageData.height, imageData);
        context.drawImage(this.bufferCanvas, 0, 0);
      }
    }
  }
  render() {
    return (
      <TransformActionWrapper>
        <DrawingActionWrapper>
          <canvas 
            className="drawing-canvas"
            ref={(canvas) => { this.canvas = canvas; }} 
            style={{ flexGrow: 1}}
          />
        </DrawingActionWrapper>
      </TransformActionWrapper>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  imageData: getImageData(state),
  transformMatrix: getTransformMatrix(state),
});

export default connect(mapStateToProps)(DrawingCanvas);