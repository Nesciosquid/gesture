import * as React from 'react';
import { connect } from 'react-redux';
import { TouchEvent, MouseEvent } from 'react';
import { startDrawing, stopDrawing, drawFromPressure } from '../../actions/canvas';
import * as _ from 'lodash';

interface DrawingCanvasProps {
  startDrawing: Function;
  stopDrawing: Function;
  draw: Function;
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
          this.props.startDrawing(x, y);
        }}
        onTouchEnd={(event: TouchEvent<HTMLDivElement>) => {
          this.props.stopDrawing();
        }}
        onTouchMove={(event: TouchEvent<HTMLDivElement>) => {
          const touch = event.touches[0];
          const x = touch.clientX - 220;
          const y = touch.clientY;
          this.props.draw(x, y, 1, 20, .1, 1);
        }}
        onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
          const x = event.clientX - 220;
          const y = event.clientY;
          this.props.startDrawing(x, y);
        }}
        onMouseUp={(event: MouseEvent<HTMLDivElement>) => {
          this.props.stopDrawing();
        }}      
        onMouseMove={(event: MouseEvent<HTMLDivElement>) => {
          const x = event.clientX - 220;
          const y = event.clientY;
          this.props.draw(x, y, 5, 30, .1, 1);        
        }}
      >
        <canvas id="canvas" style={{ flexGrow: 1}}/>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  draw: _.throttle((x: number, y: number, minSize: number, maxSize: number, minOpacity: number, maxOpacity: number) => {
    dispatch(drawFromPressure(x, y, minSize, maxSize, minOpacity, maxOpacity));
  }, 1),
  stopDrawing: () => { 
    dispatch(stopDrawing());
  },
  startDrawing: (x: number, y: number) => {
    dispatch(startDrawing(x, y));
  },
});

export default connect(null, mapDispatchToProps)(DrawingCanvas as any); //tslint:disable-line