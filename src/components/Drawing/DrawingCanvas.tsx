import * as React from 'react';
import { connect } from 'react-redux';
import { TouchEvent, MouseEvent } from 'react';
import { startDrawing, stopDrawing, drawWithCurrentTool } from '../../actions/canvas';
import { DrawPosition } from '../../types/canvas/index';
import { ReduxState } from '../../reducers/index';
import { getImageData, getTransformMatrix } from '../../selectors/canvas';
import { initCanvas } from '../../utils/canvas';
import { TransformMatrix, Transform } from '../../utils/transform';
// import { getImage } from '../../utils/canvas';

interface DrawingCanvasProps {
  startDrawing: (position: DrawPosition) => void;
  stopDrawing: () => void;
  draw: (position: DrawPosition) => void;
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
  componentDidMount() {
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
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.setTransform(matrix.scX, matrix.skX, matrix.skY, matrix.scY, matrix.tX, matrix.tY);    
        initCanvas(this.bufferCanvas, imageData.width, imageData.height, imageData);        
        context.drawImage(this.bufferCanvas, 0, 0);
      }
    }
  }
  render() {
    const transform = new Transform(this.props.transformMatrix);
    return (
      <div 
        className="pressure"
        onTouchStart={(event: TouchEvent<HTMLDivElement>) => {
          event.preventDefault();
          event.stopPropagation();
          const touch = event.touches[0];
          const x = touch.clientX - 220;
          const y = touch.clientY;
          const position = transform.invert().transformPoint({ x, y });  
          this.props.startDrawing(position);
        }}
        onTouchEnd={(event: TouchEvent<HTMLDivElement>) => {
          event.preventDefault();
          event.stopPropagation();
          this.props.stopDrawing();
        }}
        onTouchMove={(event: TouchEvent<HTMLDivElement>) => {
          event.preventDefault();
          event.stopPropagation();
          const touch = event.touches[0];
          const x = touch.clientX - 220;
          const y = touch.clientY;
          const position = transform.invert().transformPoint({ x, y });  
          this.props.draw(position);
        }}
        onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
          event.preventDefault();
          event.stopPropagation();
          const x = event.clientX - 220;
          const y = event.clientY;
          const position = transform.invert().transformPoint({ x, y });  
          this.props.startDrawing(position);
        }}
        onMouseUp={(event: MouseEvent<HTMLDivElement>) => {
          event.preventDefault();
          event.stopPropagation();
          this.props.stopDrawing();
        }}      
        onMouseMove={(event: MouseEvent<HTMLDivElement>) => {
          event.preventDefault();
          event.stopPropagation();
          const x = event.clientX - 220;
          const y = event.clientY;
          const position = transform.invert().transformPoint({ x, y });  
          this.props.draw(position);        
        }}
      >
        <canvas 
          className="drawing-canvas" 
          ref={(canvas) => { this.canvas = canvas; }} 
          id="canvas" 
          style={{ flexGrow: 1}}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  imageData: getImageData(state),
  transformMatrix: getTransformMatrix(state)
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
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawingCanvas);