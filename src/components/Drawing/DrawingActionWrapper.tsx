import * as React from 'react';
import { connect } from 'react-redux';
import { TouchEvent, MouseEvent, ReactChild } from 'react';
import { startDrawing, stopDrawing, drawWithCurrentTool } from '../../actions/canvas';
import { DrawPosition } from '../../types/canvas/index';
import { ReduxState } from '../../reducers/index';
import { TransformMatrix, Transform } from '../../utils/transform';
import * as Pressure from 'pressure';
import { getTransformMatrix } from '../../selectors/canvas';
import { changePressure } from '../../actions/tools';
import * as _ from 'lodash';

interface DrawingActionWrapperProps {
  startDrawing: (position: DrawPosition) => void;
  stopDrawing: () => void;
  draw: (position: DrawPosition) => void;
  transformMatrix: TransformMatrix;
  children: ReactChild | ReactChild[];
  changePressure: (force: number, event: Event | null) => void;
}

class DrawingActionWrapper extends React.Component<DrawingActionWrapperProps> {
  drawWrapper: HTMLDivElement | null;
  componentDidMount() {
    this.initPressure();
  }
  initPressure = () => {
    const throttledSetChange = _.throttle((force, event) => this.props.changePressure(force, event), 5);
    Pressure.set(this.drawWrapper, {
      change: throttledSetChange,
      end: () => this.props.changePressure(0, null)
    });    
  }
  render() {
    const transform = new Transform(this.props.transformMatrix);
    return (
      <div 
        className="draw-wrapper"
        ref={(drawWrapper) => { this.drawWrapper = drawWrapper; }}         
        onTouchStart={(event: TouchEvent<HTMLDivElement>) => {
          event.preventDefault();
          event.stopPropagation();
          const touch = event.touches[0];
          const x = touch.clientX - 220;
          const y = touch.clientY;
          const position = transform.invert().transformPoint({ x, y });  
          if (event.touches.length === 1) {
            this.props.startDrawing(position);
          }
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
          if (event.touches.length === 1) {
            this.props.draw(position);            
          }
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
        {
          this.props.children
        }
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  transformMatrix: getTransformMatrix(state),
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
  changePressure: (force: number, event: Event | null) => {
    dispatch(changePressure(force, event));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawingActionWrapper);