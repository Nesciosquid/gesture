import * as React from 'react';
import { connect } from 'react-redux';
import { ReactChild } from 'react';
import { drawWithCurrentTool,
  startDrawing, stopDrawing, storeGestureParams, clearStoredGestureParams } from '../../actions/viewport';
import { setTransformMatrix } from '../../actions/canvas';
// import { DrawPosition } from '../../types/canvas/index';
import { ReduxState } from '../../reducers/index';
import { TransformMatrix, Transform } from '../../utils/transform';
import { getTransformMatrix } from '../../selectors/canvas';
import { getStoredGestureParams } from '../../selectors/viewport';
import * as Hammer from 'hammerjs';
import { logHammerAction } from '../../actions/tools';
import { DrawPosition } from '../../types/canvas/index';
import { getSelectedTool } from '../../selectors/tools';
import Tool from '../../types/tools/Tool';
import { ToolType } from '../../types/tools/index';
import { GestureParams } from '../../reducers/viewport';

interface TransformActionWrapperProps {
  logHammerAction: (type: string, event: HammerInput) => void;
  transformMatrix: TransformMatrix;
  setTransformMatrix: (matrix: TransformMatrix) => void;  
  storeGestureParams: (params: GestureParams) => void;
  clearGestureParams: () => void;
  storedGestureParams: GestureParams | undefined;
  children: ReactChild | ReactChild[];
  draw: (position: DrawPosition) => void;   
  startDrawing: (position: DrawPosition) => void;
  stopDrawing: () => void;
  tool: Tool | undefined;
}

export default class TransformActionWrapper extends React.Component<TransformActionWrapperProps> {
  transformWrapper: HTMLDivElement | null;
  hammer: HammerManager | null;
  componentDidMount() {
    this.initHammer();
  }
  fixEventPosition = (position: DrawPosition) => {
    const matrix = this.props.transformMatrix;
    const transform = new Transform(matrix);
    return {x: position.x - 220, y: position.y };
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
      this.props.logHammerAction('pinchstart', event);
      this.props.storeGestureParams(event);
      event.preventDefault();
    });
    this.hammer.on('pinch', (event) => {
      this.props.logHammerAction('pinch', event);
      const currentParams = event;
      const lastParams = this.props.storedGestureParams;
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
        this.props.storeGestureParams(event);
        event.preventDefault();
      } else {
        throw new Error('no stored transform found');
      }
    });
    this.hammer.on('pinchend', (event) => {
      const transform = new Transform(this.props.transformMatrix);      
      this.props.logHammerAction('pinchEnd', event);
      this.props.clearGestureParams();
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