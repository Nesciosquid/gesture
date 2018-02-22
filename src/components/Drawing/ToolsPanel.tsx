import * as React from 'react';
import { SliderPicker, RGBColor } from 'react-color';
import { setDrawColor, setToolType } from '../../actions/canvas';
import { connect } from 'react-redux';
import { ReduxState } from '../../reducers/index';
import { ToolType } from '../../reducers/canvas';
import { Button } from 'reactstrap';

interface ToolsPanelProps {
  force: number;
  color: RGBColor;
  setColor: Function;
  setToolType: Function;
}

function ToolsPanel(props: ToolsPanelProps) {
  return (
    <div className="tools-panel">
      <SliderPicker
        color={props.color}
        onChangeComplete={(color) => props.setColor(color.rgb)}
      />
      <Button onClick={() => props.setToolType(ToolType.GRADIENTS)}>Gradients</Button>
      <Button onClick={() => props.setToolType(ToolType.CURVES)}>Curves</Button>
      <Button onClick={() => props.setToolType(ToolType.LINES)}>Lines</Button>
      <Button onClick={() => props.setToolType(ToolType.PATTERN)}>Pencil</Button>
    </div>
  );
}

function mapStateToProps(state: ReduxState) {
  return ({
    color: state.canvas.drawColor,
    force: state.pressure.change.force
  });
}

function mapDispatchToProps(dispatch: Function) {
  return ({
    setColor: (color: RGBColor) => dispatch(setDrawColor(color)),
    setToolType: (tool: ToolType) => dispatch(setToolType(tool))
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsPanel);