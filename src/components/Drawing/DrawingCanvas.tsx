import * as React from 'react';
import { connect } from 'react-redux';
import { setImageData, setBufferCanvas, setCanvas } from '../../actions/canvas';
import { ReduxState } from '../../reducers/index';
import { getImageData, getDirtyBounds } from '../../selectors/canvas';
import { getTransformMatrix } from '../../selectors/canvas';
import { initCanvas, DrawBounds, getPartialImageData } from '../../utils/canvas';
import { TransformMatrix } from '../../utils/transform';
import DrawingActionWrapper from './DrawingActionWrapper';
import TransformActionWrapper from './TransformActionWrapper';
import { stopLog } from '../../actions/performance';

interface DrawingCanvasProps {
  imageData: ImageData;
  transformMatrix: TransformMatrix;
  stopLog: () => void;
  setCanvas: (canvas: HTMLCanvasElement) => void;
  setBufferCanvas: (Canvas: HTMLCanvasElement) => void;
  dirtyBounds: DrawBounds;
}

class DrawingCanvas extends React.Component<DrawingCanvasProps> {
  canvas: HTMLCanvasElement | null;
  bufferCanvas: HTMLCanvasElement;
  constructor(props: DrawingCanvasProps) {
    super(props);
    this.bufferCanvas = document.createElement('canvas');
  }
  initCanvas() {
    const canvas = this.canvas as HTMLCanvasElement;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const bufferCanvas = this.bufferCanvas as HTMLCanvasElement;
    bufferCanvas.width = this.props.imageData.width;
    bufferCanvas.height = this.props.imageData.height;
  }
  componentDidMount() {
    this.initCanvas();
    this.props.setBufferCanvas(this.bufferCanvas);
    if (this.canvas) {
      this.props.setCanvas(this.canvas);      
    }
    const { imageData, transformMatrix } = this.props;
    this.redrawCanvas(imageData, transformMatrix);
  }
  componentWillReceiveProps(nextProps: DrawingCanvasProps) {
    // const { imageData, transformMatrix } = nextProps;
    // this.redrawCanvas(imageData, transformMatrix);
  }
  redrawCanvas = async (imageData: ImageData, matrix: TransformMatrix) => {
    if (this.canvas && imageData) {
      const context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
      const bufferContext = this.bufferCanvas.getContext('2d') as CanvasRenderingContext2D;
      const dirtyBounds = this.props.dirtyBounds;
      const partialData = getPartialImageData(this.props.imageData, dirtyBounds).data;
      const partialImageData = new ImageData(partialData, dirtyBounds.width, dirtyBounds.height);
      bufferContext.putImageData(partialImageData, 0, 0, dirtyBounds.minX, 
                                 dirtyBounds.maxX, dirtyBounds.width, dirtyBounds.height);
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);          
      context.setTransform(matrix.scX, matrix.skX, matrix.skY, matrix.scY, matrix.tX, matrix.tY);
      initCanvas(this.bufferCanvas, imageData.width, imageData.height, imageData);
      context.drawImage(this.bufferCanvas, 0, 0);
      this.props.stopLog();
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
  dirtyBounds: getDirtyBounds(state)
});

const mapDispatchToProps = (dispatch: Function) => ({
  stopLog: () => dispatch(stopLog()),
  setCanvas: (canvas: HTMLCanvasElement) => dispatch(setCanvas(canvas)),
  setBufferCanvas: (canvas: HTMLCanvasElement) => dispatch(setBufferCanvas(canvas))
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawingCanvas);