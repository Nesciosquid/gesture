import DrawingCanvas from './DrawingCanvas';
import * as React from 'react';
import { TransformMatrix } from '../../utils/transform';
import DrawingCanvasRedux from './DrawingCanvasRedux';
import { ReduxState } from '../../reducers/index';
import { getTransformMatrix } from '../../selectors/canvas';
import { connect } from 'react-redux';
import { getColorData, drawColorOntoTarget } from '../../utils/canvas';
import { RGBColor } from 'react-color';

export interface CanvasWrapperProps {
  transformMatrix: TransformMatrix;
}

export interface CanvasWrapperState {
  color: RGBColor;
}

const red = {r: 255, g: 0, b: 0 };
const green = { r: 0, g: 255, b: 0};
const blue = {r: 0, g: 0, b: 255 };

class CanvasWrapper extends React.Component<CanvasWrapperProps, CanvasWrapperState> {
  canvas: HTMLCanvasElement;

  constructor(props: CanvasWrapperProps) {
    super(props);
    this.canvas = document.createElement('canvas');    
    this.canvas.width = 1920;
    this.canvas.height = 1080;
    this.state = {
      color: red
    };
  }

  componentDidMount() {
    this.initCanvas();
    this.goRed();
    this.colorCanvas();
  }

  goRed = () => {
    this.setState({
      color: red
    });
    setTimeout(this.goGreen, 1000);
  }

  goGreen = () => {
    this.setState({
      color: green
    });
    setTimeout(this.goBlue, 1000);
  }

  goBlue = () => {
    this.setState({
      color: blue
    });
    setTimeout(this.goRed, 1000);
  }

  colorCanvas = () => {
    if (this.canvas) {
      drawColorOntoTarget(this.canvas, this.state.color);
    }
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
    this.colorCanvas();
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