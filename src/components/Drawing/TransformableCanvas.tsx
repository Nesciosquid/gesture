import * as React from 'react';
import { redrawSourceOntoTarget, redrawSourcesOntoTarget, } from '../../utils/canvas';
import { TransformMatrix, Transform } from '../../utils/transform';
import ReactResizeDetector from 'react-resize-detector';

interface TransformableCanvasProps {
  transformMatrix: TransformMatrix;
  sourceCanvases: HTMLCanvasElement[];
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
    this.redrawCanvas(this.props.sourceCanvases, this.props.transformMatrix);
  }

  initCanvas = (width: number, height: number) => {
    if (this.canvas) {
      if (this.canvas.height !== height || this.canvas.width !== width) {
        this.canvas.width = width;
        this.canvas.height = height;
      }
    }
  }

  redrawCanvas = (sourceCanvases: HTMLCanvasElement[], matrix: TransformMatrix) => {
    if (this.canvas) {
      if (this.canvas.height !== this.canvas.clientHeight) {
        this.canvas.height = this.canvas.clientHeight;
      } 
      if (this.canvas.width !== this.canvas.clientWidth) {
        this.canvas.width = this.canvas.clientWidth;
      }
      redrawSourcesOntoTarget(this.canvas, sourceCanvases, matrix);
    }
  }

  render() {
    this.redrawCanvas(this.props.sourceCanvases, this.props.transformMatrix);
    return (
      <div>
        <canvas 
          className="transformable-canvas"
          ref={(canvas) => { this.canvas = canvas; }} 
          style={{ flexGrow: 1}}
        />
        <ReactResizeDetector 
          onResize={() => this.redrawCanvas(this.props.sourceCanvases, this.props.transformMatrix)} 
        />
      </div>
    );
  }
}