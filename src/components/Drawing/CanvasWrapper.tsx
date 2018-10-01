import * as React from 'react';
import { TransformMatrix } from '../../utils/transform';
import TransformableCanvas from './TransformableCanvas';
import { DrawPosition, DrawParams } from '../../types/canvas';
import DrawingActionWrapper from './DrawingActionWrapper';
import { Transform } from '../../utils/transform';
import TransformActionWrapper from './TransformActionWrapper';
import { Tool, StrokeHistoryPoint } from '../../tools/Tool';
import { RGBColor } from 'react-color';
import { clearCanvas } from '../../utils/canvas';

export interface CanvasWrapperProps {
  canvas: HTMLCanvasElement;
  tool: Tool;
  color: RGBColor;
  onStartSampling: () => void;
  onStopSampling: () => void;
  onSample: () => void;
}

export interface CanvasWrapperState {
  transformMatrix: TransformMatrix;
}

export default class CanvasWrapper extends React.Component<CanvasWrapperProps, CanvasWrapperState> {
  pressure: number;
  isDrawing: boolean;
  strokeHistory: DrawParams[];
  strokeCanvas: HTMLCanvasElement;
  strokeBufferCanvas: HTMLCanvasElement;

  constructor(props: CanvasWrapperProps) {
    super(props);
    this.state = {
      transformMatrix: new Transform().matrix,
    };
    this.strokeHistory = [];
    this.initStrokeCanvas();
  }

  initStrokeCanvas() {
    this.strokeCanvas = document.createElement('canvas');
    this.strokeBufferCanvas = document.createElement('canvas');
    this.resizeStrokeCanvas(this.props.canvas);
  }

  resizeStrokeCanvas(sourceCanvas: HTMLCanvasElement) {
    this.strokeCanvas.width = sourceCanvas.width;
    this.strokeCanvas.height = sourceCanvas.height;
    this.strokeBufferCanvas.width = sourceCanvas.width;
    this.strokeBufferCanvas.height = sourceCanvas.height;
  }

  componentWillReceiveProps(props: CanvasWrapperProps) {
    this.resizeStrokeCanvas(props.canvas);
  }

  componentDidMount() {
    this.forceUpdate();
  }

  onChangePressure = (force: number) => {
    this.pressure = force;
  }

  getStrokeBufferSize = () => 3;

  setTransformMatrix = (matrix: TransformMatrix) => {
    this.setState({
      transformMatrix: matrix
    });
  }

  startDrawing = (position: DrawPosition) => {
    const { tool } = this.props;
    if (!this.isDrawing && tool) {
      this.isDrawing = true;
      this.props.onStartSampling();
      this.draw(position);
    }
  }

  stopDrawing = () => {
    this.isDrawing = false;
    const strokeContext = this.strokeCanvas.getContext('2d') as CanvasRenderingContext2D;
    const { tool } = this.props;

    // clearCanvas(this.strokeCanvas);
    const bufferBounds = this.getStrokeBufferBounds();
    tool.onDraw(strokeContext, this.strokeHistory, bufferBounds.start, bufferBounds.end);

    this.strokeHistory = [];
    this.bakeStroke();
    clearCanvas(this.strokeCanvas);
    clearCanvas(this.strokeBufferCanvas);

    this.forceUpdate();
    this.props.onStopSampling();
  }

  bakeStroke = () => {
    const canvasContext = this.props.canvas.getContext('2d') as CanvasRenderingContext2D;
    canvasContext.drawImage(this.strokeCanvas, 0, 0);
  }

  getDrawParams = (position: DrawPosition) => {
    return {
      position,
      color: this.props.color,
      pressure: this.pressure
    };
  }

  getStrokeBufferBounds = () => {
    let start = this.strokeHistory.length - this.getStrokeBufferSize();
    if (start < 0) {
      start = 0;
    }
    const end = this.strokeHistory.length;
    return { start, end };
  }

  getStrokeBounds = () => {
    let end = this.strokeHistory.length - this.getStrokeBufferSize();
    let start = end - 1;
    if (start < 0) {
      start = 0;
    }
    if (end < 0 ) {
      end = 0;
    }
    return { start, end };
  }

  draw = (position: DrawPosition) => {  
    const strokeContext = this.strokeCanvas.getContext('2d') as CanvasRenderingContext2D;
    const strokeBufferContext = this.strokeBufferCanvas.getContext('2d') as CanvasRenderingContext2D;

    const { tool } = this.props;
    clearCanvas(this.strokeBufferCanvas);
    if (tool && this.isDrawing) {
      this.strokeHistory.push(this.getDrawParams(position));

      const bufferBounds = this.getStrokeBufferBounds();
      const strokeBounds = this.getStrokeBounds();
      
      tool.onDraw(strokeBufferContext, this.strokeHistory, bufferBounds.start, bufferBounds.end);
      tool.onDraw(strokeContext, this.strokeHistory, strokeBounds.start, strokeBounds.end);
      this.props.onSample();
      this.forceUpdate();
    }
  }

  getAllCanvases() {
    return [
      this.props.canvas,
      this.strokeCanvas,
      this.strokeBufferCanvas,
    ];
  }

  render() {
    return (
      <TransformActionWrapper
        transformMatrix={this.state.transformMatrix}
        setTransformMatrix={this.setTransformMatrix}
      >
        <DrawingActionWrapper
          transformMatrix={this.state.transformMatrix}
          startDrawing={this.startDrawing}
          stopDrawing={this.stopDrawing}
          changePressure={this.onChangePressure}
          draw={this.draw}
        >
          <TransformableCanvas 
            sourceCanvases={this.getAllCanvases()}
            transformMatrix={this.state.transformMatrix}
          />
        </DrawingActionWrapper>
      </TransformActionWrapper>
    );
  }
}