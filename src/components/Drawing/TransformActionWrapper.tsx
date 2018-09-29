import * as React from 'react';
import { ReactChild } from 'react';
import { TransformMatrix, Transform } from '../../utils/transform';
import * as Hammer from 'hammerjs';
import { DrawPosition } from '../../types/canvas/index';

export interface TransformActionWrapperProps {
  logHammerAction?: (type: string, event: HammerInput) => void;
  transformMatrix: TransformMatrix;
  setTransformMatrix: (matrix: TransformMatrix) => void;  
  children: ReactChild | ReactChild[];
}

export interface GestureParams {
  rotation: number;
  center: { x: number, y: number };
  angle: number;
  deltaX: number;
  deltaY: number;
  scale: number;
}

export default class TransformActionWrapper extends React.Component<TransformActionWrapperProps> {
  transformWrapper: HTMLDivElement | null;
  hammer: HammerManager | null;
  gestureParams: GestureParams | undefined;
  componentDidMount() {
    this.initHammer();
  }
  clearGestureParams = () => this.gestureParams = undefined;
  setGestureParams = (params: GestureParams) => this.gestureParams = params;
  fixEventPosition = (position: DrawPosition) => {
    if (this.transformWrapper) {
      const boundingBox = this.transformWrapper.getBoundingClientRect();
      return { x: position.x - boundingBox.left, y: position.y - boundingBox.top };
    }
    return position;
  }
  initHammer = () => {
    if (!this.transformWrapper) {
      throw new Error('No transformation wrapper found.');
    } 
    this.hammer = new Hammer.Manager(this.transformWrapper, {
      recognizers: [
        [Hammer.Rotate],
        [Hammer.Pinch, {}, ['rotate']],
      ], 
    });      
    this.hammer.on('pinchstart', (event) => {
      const transform = new Transform(this.props.transformMatrix);      
      const eventPoint = this.fixEventPosition(event.center);  
      if (this.props.logHammerAction) {
        this.props.logHammerAction('pinchstart', event);
      }    
      this.setGestureParams(event);
      event.preventDefault();
    });
    this.hammer.on('pinch', (event) => {
      if (this.props.logHammerAction) {
        this.props.logHammerAction('pinch', event);
      }
      const currentParams = event;
      const lastParams = this.gestureParams;
      if (lastParams) {
        const lastTransform = new Transform(this.props.transformMatrix);
        const currentTransform = new Transform(this.props.transformMatrix);

        const lastPointViewport = this.fixEventPosition(lastParams.center);
        const currentPointViewport = this.fixEventPosition(event.center);

        const lastPointCanvas = lastTransform.invert().transformPoint(lastPointViewport);
        let currentPointCanvas = currentTransform.invert().transformPoint(currentPointViewport);
        const canvasDeltaX = currentPointCanvas.x - lastPointCanvas.x;
        const canvasDeltaY = currentPointCanvas.y - lastPointCanvas.y;

        const lastRotation = lastParams.rotation;
        const currentRotation = currentParams.rotation;
        const rotationChange = currentRotation - lastRotation;

        const lastScale = lastParams.scale;
        const currentScale = currentParams.scale;
        const scaleChange = currentScale / lastScale;

        const translated = currentTransform.translate(canvasDeltaX, canvasDeltaY);

        currentPointCanvas = translated.invert().transformPoint(currentPointViewport);

        const scaled = translated.translate(currentPointCanvas.x, currentPointCanvas.y)
          .rotate(rotationChange * (2 * Math.PI / 360))        
          .scale(scaleChange, scaleChange)
          .translate(-currentPointCanvas.x, -currentPointCanvas.y);

        this.props.setTransformMatrix(scaled.matrix);
        this.setGestureParams(event);
        event.preventDefault();
      } else {
        throw new Error('no stored transform found');
      }
    });
    this.hammer.on('pinchend', (event) => {
      const transform = new Transform(this.props.transformMatrix);      
      if (this.props.logHammerAction) {
        this.props.logHammerAction('pinchEnd', event);
      }
      this.clearGestureParams();
      event.preventDefault();      
    });
    this.transformWrapper.addEventListener('dblclick', (event: MouseEvent) => {
      const transform = new Transform(this.props.transformMatrix);      
      const point = this.fixEventPosition({ x: event.pageX, y: event.pageY });
      const txPoint = transform.invert().transformPoint(point);
      let scale = 1;
      let angle = 0;
      if (event.altKey) {
        if (event.ctrlKey) {
          angle = Math.PI / 8;
        } else {
          angle = -Math.PI / 8;
        }
        const rotated = transform.translate(txPoint.x, txPoint.y) 
          .rotate(angle)
          .translate(-txPoint.x, -txPoint.y);
        this.props.setTransformMatrix(rotated.matrix);
      } else {
        if (event.ctrlKey) {
          scale = .9;
        } else {
          scale = 1.1;
        }
        const scaled = transform.translate(txPoint.x, txPoint.y)
          .scale(scale, scale)
          .translate(-txPoint.x, -txPoint.y);
        this.props.setTransformMatrix(scaled.matrix);
      }
     
    });
  }
  render() {
    return (
      <div 
        className="transform-wrapper"
        ref={(transformWrapper) => { this.transformWrapper = transformWrapper; }}
      >
        {this.props.children}
      </div>
    );
  }
}