import * as React from 'react';
import { connect } from 'react-redux';
import { TouchEvent, MouseEvent, ReactChild } from 'react';
import { startDrawing, stopDrawing, drawWithCurrentTool } from '../../actions/viewport';
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

export default class DrawingActionWrapper extends React.Component<DrawingActionWrapperProps> {
  drawWrapper: HTMLDivElement | null;
  componentDidMount() {
    this.initPressure();
  }
  initPressure = () => {
    const throttledSetChange = _.throttle((force, event) => this.props.changePressure(force, event), 0);
    Pressure.set(
      this.drawWrapper, 
      {
        change: throttledSetChange,
        end: () => this.props.changePressure(0, null), 
      },
      { only: 'pointer' }
    );
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
          for (let i = 0; i < event.touches.length; i++ ) {
            const thisTouch: any = event.touches[i]; //tslint:disable-line
            if (thisTouch.touchType === 'stylus') {
              const x = thisTouch.clientX - 220;
              const y = thisTouch.clientY;
              const position = transform.invert().transformPoint({ x, y });  
              this.props.startDrawing(position);              
            }
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
          for (let i = 0; i < event.touches.length; i++ ) {
            const thisTouch: any = event.touches[i]; //tslint:disable-line
            if (thisTouch.touchType === 'stylus') {
              const x = thisTouch.clientX - 220;
              const y = thisTouch.clientY;
              const position = transform.invert().transformPoint({ x, y });  
              this.props.draw(position);              
            }
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