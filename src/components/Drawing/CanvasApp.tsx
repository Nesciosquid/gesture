import * as React from 'react';
import DrawingCanvas from './DrawingCanvas';
import CanvasWrapper from './CanvasWrapper';
import ToolsPanel from './ToolsPanel';
import './Drawing.scss';
import { ReduxState } from '../../reducers/index';
import { connect } from 'react-redux';
import Tool from '../../types/tools/Tool';
import { setSelectedTool } from '../../actions/tools';

export interface CanvasAppProps {
  startingTool: Tool;
  setSelectedTool: (tool: Tool) => void;
}

class CanvasApp extends React.Component<CanvasAppProps, {}> {
  render() {
    return(
      <div className="drawing-app">
        <div className="tools-container">
          <ToolsPanel />
        </div>
        <div className="canvas-container">
          <CanvasWrapper />
          {/* <DrawingCanvas /> */}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: ReduxState) {
  return ({
    startingTool: state.tools.tools.options.pencil
  });
}

function mapDispatchToProps(dispatch: Function) {
  return ({
    setSelectedTool: (tool: Tool) => dispatch(setSelectedTool(tool))
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasApp);