import * as React from 'react';
import { connect } from 'react-redux';
import { Tool } from '../../tools/Tool';
import { Button } from 'reactstrap';
import { ReduxState } from '../../reducers/index';
import { setSelectedTool } from '../../actions/tools';
import { isToolSelected } from '../../selectors/tools'; 

interface ToolButtonProps {
  tool: Tool;
  selected: boolean;
  selectTool: () => void;
}

function ToolButton({ selected, selectTool, tool}: ToolButtonProps) {
  const color = selected ? 'primary' : 'secondary';
  return (
    <Button color={color} onClick={selectTool}>
      {tool.getName()}
    </Button>
  );
}

function mapStateToProps(state: ReduxState, { tool }: {tool: Tool}) {
  return ({
    selected: isToolSelected(state, tool),
  });
}

function mapDispatchToProps(dispatch: Function, { tool }: { tool: Tool}) {
  return ({
    selectTool: () => dispatch(setSelectedTool(tool))
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolButton);