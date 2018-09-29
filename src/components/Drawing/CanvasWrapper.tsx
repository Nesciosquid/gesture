import DrawingCanvas from './DrawingCanvas';
import * as React from 'react';
import { TransformMatrix } from '../../utils/transform';
import DrawingCanvasRedux from './DrawingCanvasRedux';
import { ReduxState } from '../../reducers/index';
import { getTransformMatrix } from '../../selectors/canvas';
import { connect } from 'react-redux';
import { getColorData } from '../../utils/canvas';

export interface CanvasWrapperProps {
  transformMatrix: TransformMatrix;
}

class CanvasWrapper extends React.Component<CanvasWrapperProps> {
  canvas: HTMLCanvasElement;

  constructor(props: CanvasWrapperProps) {
    super(props);
    this.canvas = document.createElement('canvas');    
    this.canvas.width = 1920;
    this.canvas.height = 1080;
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');    
    this.canvas.width = 1920;
    this.canvas.height = 1080;
    const context = this.canvas.getContext('2d');
    if (context) {
      const bg = getColorData({ r: 211, g: 211, b: 211 }, this.canvas.width, this.canvas.height);
      context.putImageData(bg, 0, 0);
    }
  }

  render() {
    return (
      <DrawingCanvasRedux 
        sourceCanvas={this.canvas}
        transformMatrix={this.props.transformMatrix}
      />
    );
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    transformMatrix: getTransformMatrix(state)
  };
};

export default connect(mapStateToProps)(CanvasWrapper);