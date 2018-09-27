import * as React from 'react';
import { SketchPicker, RGBColor } from 'react-color';
import { clear } from '../../actions/canvas';
import { setColor } from '../../actions/tools';
import { connect } from 'react-redux';
import { ReduxState } from '../../reducers/index';
import { ToolOptions } from '../../types/tools';
import { Button } from 'reactstrap';
import ToolButton from './ToolButton';
import SaveButton from './SaveButton';
import { setTransformMatrix } from '../../actions/canvas';
import { getTransformMatrix } from '../../selectors/canvas';
import { getToolOptions, getColor } from '../../selectors/tools';
import { TransformMatrix, Transform } from '../../utils/transform';
import { getAverageLog, getSampleRate } from '../../selectors/performance';
import HammerActionViewer from './HammerActionViewer';

interface ToolsPanelProps {
  color: RGBColor;
  setColor: (color: RGBColor) => void;
  clear: (layer: number) => void;
  toolOptions: ToolOptions;
  transformMatrix: TransformMatrix;
  setTransformMatrix: (matrix: TransformMatrix) => void;
  averageLog: number;
  sampleRate: number;
}

function ToolsPanel(props: ToolsPanelProps) {
  const translateX = (x: number) => {
    const transform = new Transform(props.transformMatrix);
    const translated = transform.translate(x, 0);
    props.setTransformMatrix(translated.matrix);
  };
  const rotate = (angle: number) => {
    const transform = new Transform(props.transformMatrix);
    props.setTransformMatrix(transform.rotate(angle).matrix);
  };
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
      <Button onClick={() => props.clear(1)}>Clear</Button>
      <div style={{height: '50px' }} />
      {/* <HammerActionViewer /> */}
      <SaveButton />
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
    transformMatrix: getTransformMatrix(state),
    averageLog: getAverageLog(state),
    sampleRate: getSampleRate(state)
  });
}

function mapDispatchToProps(dispatch: Function) {
  return ({
    setColor: (color: RGBColor) => dispatch(setColor(color)),
    clear: (layer: number) => dispatch(clear(layer)),
    setTransformMatrix: (matrix: TransformMatrix) => dispatch(setTransformMatrix(matrix))
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsPanel);