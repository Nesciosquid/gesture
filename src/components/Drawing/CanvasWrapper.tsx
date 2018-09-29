import * as React from 'react';
import { TransformMatrix } from '../../utils/transform';
import TransformableCanvas from './TransformableCanvas';
import { DrawPosition, DrawParams } from '../../types/canvas';
import DrawingActionWrapper from './DrawingActionWrapper';
import { Transform } from '../../utils/transform';
import TransformActionWrapper from './TransformActionWrapper';
import { ToolType } from '../../types/tools';
import { drawFromPatternInContext, drawLinesInContext, drawGradientsInContext } from '../../utils/canvas';
import Tool from '../../types/tools/Tool';
import { RGBColor } from 'react-color';
import { getDrawParams } from '../../utils/tools';

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
  lastParams?: DrawParams;
  
  constructor(props: CanvasWrapperProps) {
    super(props);
    this.state = {
      transformMatrix: new Transform().matrix,
    };
  }

  componentDidMount() {
    this.forceUpdate();
  }

  onChangePressure = (force: number) => {
    this.pressure = force;
  }

  setTransformMatrix = (matrix: TransformMatrix) => {
    this.setState({
      transformMatrix: matrix
    });
  }

  startDrawing = (position: DrawPosition) => {
    const { tool, color } = this.props;
    if (!this.isDrawing && tool) {
      const drawParams = getDrawParams(tool, position, color, this.pressure);
      this.isDrawing = true;
      this.lastParams = drawParams;
      this.props.onStartSampling();
    }
  }

  stopDrawing = () => {
    this.lastParams = undefined;
    this.isDrawing = false;
    this.props.onStopSampling();
  }

  draw = (position: DrawPosition) => {  
    const context = this.props.canvas.getContext('2d') as CanvasRenderingContext2D;
    const { tool, color } = this.props;
    if (tool && this.isDrawing) {
      const lastParams = this.lastParams;
      const params = getDrawParams(tool, position, color, this.pressure);
      switch (this.props.tool.type) {
        case (ToolType.PATTERN): {
          drawFromPatternInContext(context, params, lastParams);
          break;
        } 
        case (ToolType.LINES): {
          drawLinesInContext(context, params, lastParams);
          break;
        }
        case (ToolType.GRADIENTS): {
          drawGradientsInContext(context, params, lastParams);
          break;
        }
        default: 
          break;
      }
      this.lastParams = params;
      this.props.onSample();
      this.forceUpdate();
    }
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
            sourceCanvas={this.props.canvas}
            transformMatrix={this.state.transformMatrix}
          />
        </DrawingActionWrapper>
      </TransformActionWrapper>
    );
  }
}