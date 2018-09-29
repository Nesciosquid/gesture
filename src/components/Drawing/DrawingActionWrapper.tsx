import * as React from 'react';
import { TouchEvent, MouseEvent, ReactChild } from 'react';
import { DrawPosition } from '../../types/canvas/index';
import { TransformMatrix, Transform } from '../../utils/transform';
import * as Pressure from 'pressure';
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
  fixEventPosition = (position: DrawPosition) => {
    if (this.drawWrapper) {
      const boundingBox = this.drawWrapper.getBoundingClientRect();
      return { x: position.x - boundingBox.left, y: position.y - boundingBox.top };
    }
    return position;
  }
  initPressure = () => {
    const throttledSetChange = _.throttle((force, event) => this.props.changePressure(force, event), 0);
    Pressure.set(
      this.drawWrapper, 
      {
        change: throttledSetChange,
        end: () => this.props.changePressure(0, null), 
      },
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
              const touchPosition = this.fixEventPosition({ x: thisTouch.clientX, y: thisTouch.clientY });
              const position = transform.invert().transformPoint(touchPosition);  
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
              const touchPosition = this.fixEventPosition({ x: thisTouch.clientX, y: thisTouch.clientY });
              const position = transform.invert().transformPoint(touchPosition);  
              this.props.draw(position);              
            }
          }
        }}
        onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
          event.preventDefault();
          event.stopPropagation();
          const eventPosition = this.fixEventPosition({ x: event.clientX, y: event.clientY });
          const position = transform.invert().transformPoint(eventPosition);  
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
          const eventPosition = this.fixEventPosition({ x: event.clientX, y: event.clientY });
          const position = transform.invert().transformPoint(eventPosition);  
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