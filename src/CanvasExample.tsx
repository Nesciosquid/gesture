import * as React from 'react';
import { connect } from 'react-redux';
import { TouchEvent, MouseEvent } from 'react';
import { startDrawing, stopDrawing, drawFromPressure } from './actions/canvas';

interface CanvasExampleProps {
  startDrawing: Function;
  stopDrawing: Function;
  draw: Function;
}

class CanvasExample extends React.Component<CanvasExampleProps> {
  render() {
    return (
      <div 
        onTouchStart={(event: TouchEvent<HTMLDivElement>) => {
          const touch = event.touches[0];
          const x = touch.clientX;
          const y = touch.clientY;
          this.props.startDrawing(x, y);
        }}
        onTouchEnd={(event: TouchEvent<HTMLDivElement>) => {
          this.props.stopDrawing();
        }}
        onTouchMove={(event: TouchEvent<HTMLDivElement>) => {
          const touch = event.touches[0];
          const x = touch.clientX;
          const y = touch.clientY;
          this.props.draw(x, y, 10, 50, .2, 1);
        }}
        onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
          const x = event.clientX;
          const y = event.clientY;
          this.props.startDrawing(x, y);
        }}
        onMouseUp={(event: MouseEvent<HTMLDivElement>) => {
          this.props.stopDrawing();
        }}      
        onMouseMove={(event: MouseEvent<HTMLDivElement>) => {
          const x = event.clientX;
          const y = event.clientY;
          this.props.draw(x, y, 10, 50, .2, 1);        
        }}
        style={{width: '100%', height: '100%'}}
      >
        <div 
          className="pressure" 
          style={{
            width: '100%', 
            height: '100%', 
            position: 'absolute', 
            background: 'none', 
            zIndex: 99 
          }} 
        />
        <canvas id="canvas" style={{width: '100%', height: '100%' }}/>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  draw: (x: number, y: number, minSize: number, maxSize: number, minOpacity: number, maxOpacity: number) => {
    dispatch(drawFromPressure(x, y, minSize, maxSize, minOpacity, maxOpacity));
  },
  stopDrawing: () => { 
    dispatch(stopDrawing());
  },
  startDrawing: (x: number, y: number) => {
    dispatch(startDrawing(x, y));
  }
});

export default connect(null, mapDispatchToProps)(CanvasExample as any); //tslint:disable-line