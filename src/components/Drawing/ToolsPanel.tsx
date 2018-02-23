import * as React from 'react';
import { SketchPicker, RGBColor } from 'react-color';
import { clear } from '../../actions/canvas';
import { setColor } from '../../actions/tools';
import { connect } from 'react-redux';
import { ReduxState } from '../../reducers/index';
import { ToolOptions } from '../../types/tools';
import { Button } from 'reactstrap';
import ToolButton from './ToolButton';
import { getToolOptions, getColor } from '../../selectors/tools';

interface ToolsPanelProps {
  color: RGBColor;
  setColor: (color: RGBColor) => void;
  clear: () => void;
  toolOptions: ToolOptions;
}

function ToolsPanel(props: ToolsPanelProps) {
  return (
    <div className="tools-panel">
      <SketchPicker
        color={props.color}
        onChangeComplete={(color) => props.setColor(color.rgb)}
      />
      {
        Object.keys(props.toolOptions).map((toolId: string) => {
          const tool = props.toolOptions[toolId];
          return <ToolButton tool={tool} key={tool.id} />;
        })
      }
      <div style={{height: '50px' }} />
      <Button onClick={() => props.clear()}>Clear</Button>
    </div>
  );
}

function mapStateToProps(state: ReduxState) {
  return ({
    color: getColor(state),
    toolOptions: getToolOptions(state)
  });
}

function mapDispatchToProps(dispatch: Function) {
  return ({
    setColor: (color: RGBColor) => dispatch(setColor(color)),
    clear: () => dispatch(clear())
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsPanel);