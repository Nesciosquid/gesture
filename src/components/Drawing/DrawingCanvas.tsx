import * as React from 'react';
import { connect } from 'react-redux';
import { TouchEvent, MouseEvent } from 'react';
import { startDrawing, stopDrawing, drawWithCurrentTool } from '../../actions/canvas';
import { DrawPosition } from '../../types/canvas/index';

interface DrawingCanvasProps {
  startDrawing: (position: DrawPosition) => void;
  stopDrawing: () => void;
  draw: (position: DrawPosition) => void;
}

class DrawingCanvas extends React.Component<DrawingCanvasProps> {
  render() {
    return (
      <div 
        className="pressure"
        onTouchStart={(event: TouchEvent<HTMLDivElement>) => {
          const touch = event.touches[0];
          const x = touch.clientX - 220;
          const y = touch.clientY;
          this.props.startDrawing({x, y});
        }}
        onTouchEnd={(event: TouchEvent<HTMLDivElement>) => {
          this.props.stopDrawing();
        }}
        onTouchMove={(event: TouchEvent<HTMLDivElement>) => {
          const touch = event.touches[0];
          const x = touch.clientX - 220;
          const y = touch.clientY;
          this.props.draw({x, y});
        }}
        onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
          const x = event.clientX - 220;
          const y = event.clientY;
          this.props.startDrawing({x, y});
        }}
        onMouseUp={(event: MouseEvent<HTMLDivElement>) => {
          this.props.stopDrawing();
        }}      
        onMouseMove={(event: MouseEvent<HTMLDivElement>) => {
          const x = event.clientX - 220;
          const y = event.clientY;
          this.props.draw({x, y});        
        }}
      >
        <canvas id="canvas" style={{ flexGrow: 1}}/>
      </div>
    );
  }
}

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

export default connect(null, mapDispatchToProps)(DrawingCanvas as any); //tslint:disable-line