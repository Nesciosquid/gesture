import * as React from 'react';
import { connect } from 'react-redux';
import { setImageData } from '../../actions/canvas';
import { ReduxState } from '../../reducers/index';
import { getImageData, getTransformMatrix, getDirtyBounds } from '../../selectors/canvas';
import { initCanvas, DrawBounds, getPartialImageData } from '../../utils/canvas';
import { TransformMatrix } from '../../utils/transform';
import DrawingActionWrapper from './DrawingActionWrapper';
import TransformActionWrapper from './TransformActionWrapper';

interface DrawingCanvasProps {
  imageData: ImageData;
  transformMatrix: TransformMatrix;
  dirtyBounds: DrawBounds | undefined;
  setImageData: (imageData: ImageData) => void;
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
      this.props.setImageData(new ImageData(this.canvas.width, this.canvas.height));
    } else {
      throw new Error('No canvas found.');
    }
  }
  componentDidMount() {
    this.initCanvas();
    const { imageData, transformMatrix, dirtyBounds } = this.props;
    this.redrawCanvas(imageData, transformMatrix, dirtyBounds);
  }
  componentWillReceiveProps(nextProps: DrawingCanvasProps) {
    const { imageData, transformMatrix, dirtyBounds } = nextProps;
    this.redrawCanvas(imageData, transformMatrix, dirtyBounds);
  }
  redrawCanvas = async (imageData: ImageData, matrix: TransformMatrix, dirtyBounds?: DrawBounds) => {
    if (this.canvas && imageData) {
      const context = this.canvas.getContext('2d');
      if (context) {
        if (dirtyBounds) {
          context.setTransform(matrix.scX, matrix.skX, matrix.skY, matrix.scY, matrix.tX, matrix.tY);    
          context.globalCompositeOperation = 'destination-in';          
          context.fillStyle = 'red';
          context.fillRect(0, 0, imageData.width, imageData.height);
          context.globalCompositeOperation = 'source-over';
          context.clearRect(dirtyBounds.minX, dirtyBounds.minY, dirtyBounds.width, dirtyBounds.height);       
          const dirtyImageData = new ImageData(getPartialImageData(imageData, dirtyBounds).data, 
                                               dirtyBounds.width, dirtyBounds.height);

          initCanvas(this.bufferCanvas, dirtyBounds.width, dirtyBounds.height, dirtyImageData);
          context.drawImage(this.bufferCanvas, dirtyBounds.minX, dirtyBounds.minY);
        }
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
  dirtyBounds: getDirtyBounds(state),
});

const mapDispatchToProps = (dispatch: Function) => ({
  setImageData: (imageData: ImageData) => {
    dispatch(setImageData(imageData));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawingCanvas);