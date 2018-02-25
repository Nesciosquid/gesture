import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { TouchEvent, MouseEvent } from 'react';
import { startDrawing, stopDrawing, drawWithCurrentTool, setImageData } from '../../actions/canvas';
import { DrawPosition } from '../../types/canvas/index';
import { ReduxState } from '../../reducers/index';
import { getImageData, getTransformMatrix, getDirtyBounds } from '../../selectors/canvas';
import { initCanvas, DrawBounds, getPartialImageData } from '../../utils/canvas';
import { TransformMatrix, Transform } from '../../utils/transform';
import * as Pressure from 'pressure';
import { changePressure } from '../../actions/tools';

interface DrawingCanvasProps {
  startDrawing: (position: DrawPosition) => void;
  stopDrawing: () => void;
  draw: (position: DrawPosition) => void;
  imageData: ImageData;
  transformMatrix: TransformMatrix;
  dirtyBounds: DrawBounds | undefined;
  setImageData: (imageData: ImageData) => void;
  changePressure: (force: number, event: Event | null) => void;
}

class DrawingCanvas extends React.Component<DrawingCanvasProps> {
  canvas: HTMLCanvasElement | null;
  bufferCanvas: HTMLCanvasElement;
  constructor(props: DrawingCanvasProps) {
    super(props);
    this.bufferCanvas = document.createElement('canvas');
  }
  initCanvas() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      this.props.setImageData(new ImageData(canvas.width, canvas.height));
    }
    const throttledSetChange = _.throttle((force, event) => this.props.changePressure(force, event), 5);
    Pressure.set('.pressure', {
      change: throttledSetChange,
      end: () => this.props.changePressure(0, null)
    });    
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
          context.clearRect(dirtyBounds.minX, dirtyBounds.minY, dirtyBounds.width, dirtyBounds.height);          
          const dirtyImageData = new ImageData(getPartialImageData(imageData, dirtyBounds).data, 
                                               dirtyBounds.width, dirtyBounds.height);
          initCanvas(this.bufferCanvas, dirtyBounds.width, dirtyBounds.height, dirtyImageData);
          context.drawImage(this.bufferCanvas, dirtyBounds.minX, dirtyBounds.minY);
        } else {
          context.setTransform(matrix.scX, matrix.skX, matrix.skY, matrix.scY, matrix.tX, matrix.tY);    
          context.clearRect(0, 0, this.canvas.width, this.canvas.height);          
          initCanvas(this.bufferCanvas, imageData.width, imageData.height, imageData);        
          context.drawImage(this.bufferCanvas, 0, 0);
        }
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
  transformMatrix: getTransformMatrix(state),
  dirtyBounds: getDirtyBounds(state),
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
  setImageData: (imageData: ImageData) => {
    dispatch(setImageData(imageData));
  },
  changePressure: (force: number, event: Event | null) => {
    dispatch(changePressure(force, event));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawingCanvas);