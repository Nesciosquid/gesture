import * as React from 'react';
import { SketchPicker, RGBColor } from 'react-color';
import { setColor } from '../../actions/tools';
import { connect } from 'react-redux';
import { ReduxState } from '../../reducers/index';
import { ToolOptions } from '../../types/tools';
import { Button } from 'reactstrap';
import ToolButton from './ToolButton';
import SaveButton from './SaveButton';
import { getToolOptions, getColor } from '../../selectors/tools';
import { TransformMatrix, Transform } from '../../utils/transform';
import { getAverageLog, getSampleRate } from '../../selectors/performance';

interface ToolsPanelProps {
  color: RGBColor;
  setColor: (color: RGBColor) => void;
  toolOptions: ToolOptions;
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
      {
        Object.keys(props.toolOptions).map((toolId: string) => {
          const tool = props.toolOptions[toolId];
          return <ToolButton tool={tool} key={tool.id} />;
        })
      }
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
    toolOptions: getToolOptions(state),
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