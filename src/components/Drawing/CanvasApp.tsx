import * as React from 'react';
import CanvasWrapper from './CanvasWrapper';
import ToolsPanel from './ToolsPanel';
import './Drawing.scss';
import { ReduxState } from '../../reducers/index';
import { connect } from 'react-redux';
import Tool from '../../types/tools/Tool';
import { setSelectedTool } from '../../actions/tools';
import { getColorData } from '../../utils/canvas';
import { getSelectedTool, getColor } from '../../selectors/tools';
import { RGBColor } from 'react-color';
import { startSampling, stopSampling, addSample } from '../../actions/performance';

export interface CanvasAppProps {
  tool: Tool;
  color: RGBColor;
  onStartSampling: () => void;
  onStopSampling: () => void;
  onSample: () => void;
}

class CanvasApp extends React.Component<CanvasAppProps, {}> {
  canvas: HTMLCanvasElement;
  constructor(props: CanvasAppProps) {
    super(props);
    this.initCanvas();
  }

  initCanvas = () => {
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
    return(
      <div className="drawing-app">
        <div className="tools-container">
          <ToolsPanel />
        </div>
        <div className="canvas-container">
          <CanvasWrapper 
            tool={this.props.tool}
            color={this.props.color}
            canvas={this.canvas}
            onStartSampling={this.props.onStartSampling}
            onStopSampling={this.props.onStopSampling}
            onSample={this.props.onSample}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: ReduxState) {
  return ({
    tool: getSelectedTool(state),
    color: getColor(state)
  });
}

function mapDispatchToProps(dispatch: Function) {
  return ({
    onStartSampling: () => dispatch(startSampling()),
    onStopSampling: () => dispatch(stopSampling()),
    onSample: () => dispatch(addSample())
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasApp);