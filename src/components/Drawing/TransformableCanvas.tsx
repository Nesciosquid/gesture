import * as React from 'react';
import { redrawSourceOntoTarget, } from '../../utils/canvas';
import { TransformMatrix, Transform } from '../../utils/transform';
import ReactResizeDetector from 'react-resize-detector';

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
    if (!this.canvas) {
      return;
    }
    this.initCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
    this.redrawCanvas(this.props.sourceCanvas, this.props.transformMatrix);
  }

  initCanvas = (width: number, height: number) => {
    if (this.canvas) {
      if (this.canvas.height !== height || this.canvas.width !== width) {
        this.canvas.width = width;
        this.canvas.height = height;
      }
    }
  }

  redrawCanvas = (sourceCanvas: HTMLCanvasElement, matrix: TransformMatrix) => {
    console.log("Redrawing");
    if (this.canvas) {
      if (this.canvas.height !== this.canvas.clientHeight) {
        this.canvas.height = this.canvas.clientHeight;
      } 
      if (this.canvas.width !== this.canvas.clientWidth) {
        this.canvas.width = this.canvas.clientWidth;
      }
      redrawSourceOntoTarget(this.canvas, sourceCanvas, matrix);      
    }
  }

  render() {
    this.redrawCanvas(this.props.sourceCanvas, this.props.transformMatrix);
    return (
      <div>
        <canvas 
          className="transformable-canvas"
          ref={(canvas) => { this.canvas = canvas; }} 
          style={{ flexGrow: 1}}
        />
        <ReactResizeDetector 
          onResize={() => this.redrawCanvas(this.props.sourceCanvas, this.props.transformMatrix)} />
      </div>
    );
  }
}