import * as React from 'react';
import { connect } from 'react-redux';
import { ReactChild } from 'react';
import { setTransformMatrix, storeTransform, clearStoredTransform, 
  drawWithCurrentTool, startDrawing, stopDrawing } from '../../actions/canvas';
// import { DrawPosition } from '../../types/canvas/index';
import { ReduxState } from '../../reducers/index';
import { TransformMatrix, Transform } from '../../utils/transform';
import { getTransformMatrix, getStoredTransform } from '../../selectors/canvas';
import * as Hammer from 'hammerjs';
import { logHammerAction } from '../../actions/tools';
import { DrawPosition } from '../../types/canvas/index';
import { getSelectedTool } from '../../selectors/tools';
import Tool from '../../types/tools/Tool';
import { ToolType } from '../../types/tools/index';

interface TransformActionWrapperProps {
  logHammerAction: (type: string, event: HammerInput) => void;
  transformMatrix: TransformMatrix;
  storedTransform: TransformMatrix | undefined;
  setTransformMatrix: (matrix: TransformMatrix) => void;  
  storeTransform: (matrix: TransformMatrix) => void;
  clearStoredTransform: () => void;
  children: ReactChild | ReactChild[];
  draw: (position: DrawPosition) => void;   
  startDrawing: (position: DrawPosition) => void;
  stopDrawing: () => void;
  tool: Tool;
}

class DrawingActionWrapper extends React.Component<TransformActionWrapperProps> {
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
      this.props.storeTransform(transform.matrix);
        // this.props.startDrawing(eventPoint);        
      event.preventDefault();
    });
    this.hammer.on('pinch', (event) => {
      this.props.logHammerAction('pinch', event);
      const transform = new Transform(this.props.transformMatrix);      
      if (this.props.storedTransform) {
        const storedTransform = new Transform(this.props.storedTransform);
        const eventPoint = this.fixEventPosition(event.center);
        // const translated = storedTransform.translate(event.deltaX, event.deltaY);
        const scaled = storedTransform.scale(event.scale, event.scale);
        this.props.setTransformMatrix(scaled.matrix);
        // this.props.draw(eventPoint);
        event.preventDefault();
      } else {
        throw new Error('no stored transform found');
      }
    });
    this.hammer.on('pinchend', (event) => {
      const transform = new Transform(this.props.transformMatrix);      
      this.props.logHammerAction('pinchEnd', event);
      this.props.clearStoredTransform();
      // this.props.stopDrawing();
      event.preventDefault();      
    });
    this.transformWrapper.addEventListener('dblclick', (event: MouseEvent) => {
      const transform = new Transform(this.props.transformMatrix);      
      const point = this.fixEventPosition({ x: event.pageX, y: event.pageY });
      const txPoint = transform.transformPoint(point);
      let scale = 1;
      if (event.ctrlKey) {
        scale = .9;
      } else {
        scale = 1.1;
      }
      const scaled = transform.translate(txPoint.x, txPoint.y)
        .scale(scale, scale)
        .translate(-txPoint.x, -txPoint.y);
      this.props.setTransformMatrix(scaled.matrix);
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

const mapStateToProps = (state: ReduxState) => ({
  transformMatrix: getTransformMatrix(state),
  storedTransform: getStoredTransform(state),
  tool: getSelectedTool(state)
});

const mapDispatchToProps = (dispatch: Function) => ({
  startDrawing: (position: DrawPosition) => {
    dispatch(startDrawing(position));
  },
  stopDrawing: () => {
    dispatch(stopDrawing);
  },
  draw: (position: DrawPosition) => {
    dispatch(drawWithCurrentTool(position));
  },
  setTransformMatrix: (matrix: TransformMatrix) => {
    dispatch(setTransformMatrix(matrix));
  },
  logHammerAction: (type: string, event: HammerInput) => {
    dispatch(logHammerAction(type, event));
  },
  storeTransform: (matrix: TransformMatrix) => { dispatch(storeTransform(matrix)); },
  clearStoredTransform: () => { dispatch(clearStoredTransform()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawingActionWrapper);