import * as React from 'react';
import { SketchPicker, RGBColor } from 'react-color';
import { setColor } from '../../actions/tools';
import { connect } from 'react-redux';
import { ReduxState } from '../../reducers/index';
import { Button } from 'reactstrap';
import ToolButton from './ToolButton';
import SaveButton from './SaveButton';
import { getToolOptions, getColor } from '../../selectors/tools';
import { TransformMatrix, Transform } from '../../utils/transform';
import { getAverageLog, getSampleRate } from '../../selectors/performance';
import { Tool } from '../../tools/Tool';

interface ToolsPanelProps {
  color: RGBColor;
  setColor: (color: RGBColor) => void;
  tools: Tool[];
  averageLog: number;
  sampleRate: number;
}

function ToolsPanel(props: ToolsPanelProps) {
  return (
    <div className="tools-panel">
      {/* <SketchPicker
        color={props.color}
        onChangeComplete={(color) => props.setColor(color.rgb)}
      /> */}
      {props.tools.map(tool => <ToolButton tool={tool} key={tool.getId()} />)}
      <div style={{height: '50px' }} />
      {/* <Button onClick={() => props.clear(1)}>Clear</Button> */}
      <div style={{height: '50px' }} />
      {/* <HammerActionViewer /> */}
      {/* <SaveButton /> */}
      Draw Time: {props.averageLog}
      <div style={{height: '10px' }} />
      Sample Rate: {props.sampleRate}
    </div>
  );
}

function mapStateToProps(state: ReduxState) {
  return ({
    color: getColor(state),
    tools: getToolOptions(state),
    averageLog: getAverageLog(state),
    sampleRate: getSampleRate(state)
  });
}

function mapDispatchToProps(dispatch: Function) {
  return ({
    setColor: (color: RGBColor) => dispatch(setColor(color)),
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsPanel);