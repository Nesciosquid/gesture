import * as React from 'react';
import { connect } from 'react-redux';
import { TouchEvent, MouseEvent } from 'react';
import { startDrawing, stopDrawing, drawWithCurrentTool } from '../../actions/canvas';
import { DrawPosition } from '../../types/canvas/index';
import { ReduxState } from '../../reducers/index';
import { getImageData } from '../../selectors/canvas';

interface DrawingCanvasProps {
  startDrawing: (position: DrawPosition) => void;
  stopDrawing: () => void;
  draw: (position: DrawPosition) => void;
  imageData: ImageData;
}

class DrawingCanvas extends React.Component<DrawingCanvasProps> {
  canvas: HTMLCanvasElement | null;
  componentDidMount() {
    this.redrawCanvas(this.props.imageData);
  }
  componentWillReceiveProps(nextProps: DrawingCanvasProps) {
    this.redrawCanvas(nextProps.imageData);
  }
  redrawCanvas = (imageData: ImageData) => {
    if (this.canvas && imageData) {
      const context = this.canvas.getContext('2d');
      if (context) {
        context.putImageData(imageData, 0, 0);
      }
    }
  }
  render() {
    return (
      <div 
        className="pressure"
        onTouchStart={(event: TouchEvent<HTMLDivElement>) => {
          event.preventDefault();
          event.stopPropagation();
          const touch = event.touches[0];
          const x = touch.clientX - 220;
          const y = touch.clientY;
          this.props.startDrawing({x, y});
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
          this.props.draw({x, y});
        }}
        onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
          event.preventDefault();
          event.stopPropagation();
          const x = event.clientX - 220;
          const y = event.clientY;
          this.props.startDrawing({x, y});
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
          this.props.draw({x, y});        
        }}
      >
        <canvas ref={(canvas) => { this.canvas = canvas; }} id="canvas" style={{ flexGrow: 1}}/>
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  imageData: getImageData(state)
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