import * as React from 'react';
import { connect } from 'react-redux';
import { setImageData, setBufferCanvas, setCanvas } from '../../actions/canvas';
import { ReduxState } from '../../reducers/index';
import { getImageData, getDirtyBounds } from '../../selectors/canvas';
import { getTransformMatrix } from '../../selectors/canvas';
import { initCanvas, DrawBounds, getPartialImageData, redrawSourceOntoTarget } from '../../utils/canvas';
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
  sourceCanvas: HTMLCanvasElement;
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
    //this.redrawCanvas(imageData, transformMatrix);
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
      // <TransformActionWrapper>
      //   <DrawingActionWrapper>
          <canvas 
            className="drawing-canvas"
            ref={(canvas) => { this.canvas = canvas; }} 
            style={{ flexGrow: 1}}
          />
      //   </DrawingActionWrapper>
      // </TransformActionWrapper>
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