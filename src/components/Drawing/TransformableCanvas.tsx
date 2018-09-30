import * as React from 'react';
import { redrawSourceOntoTarget, } from '../../utils/canvas';
import { TransformMatrix } from '../../utils/transform';

interface TransformableCanvasProps {
  transformMatrix: TransformMatrix;
  sourceCanvas: HTMLCanvasElement;
}

export default class TransformableCanvas extends React.Component<TransformableCanvasProps> {
  canvas: HTMLCanvasElement | null;
  constructor(props: TransformableCanvasProps) {
    super(props);
  }

  componentDidMount() {
    this.initCanvas();
    this.redrawCanvas(this.props.sourceCanvas, this.props.transformMatrix);
  }

  initCanvas = () => {
    if (this.canvas) {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    }
  }

  redrawCanvas = (sourceCanvas: HTMLCanvasElement, matrix: TransformMatrix) => {
    if (this.canvas) {
      redrawSourceOntoTarget(this.canvas, sourceCanvas, matrix);      
    }
  }

  render() {
    this.redrawCanvas(this.props.sourceCanvas, this.props.transformMatrix);
    return (
      <canvas 
        className="transformable-canvas"
        ref={(canvas) => { this.canvas = canvas; }} 
        style={{ flexGrow: 1}}
      />
    );
  }
}
