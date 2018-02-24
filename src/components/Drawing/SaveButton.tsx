import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { ReduxState } from '../../reducers/index';
import { saveToPng } from '../../utils/canvas'; 
import { getImageData } from '../../selectors/canvas';

interface ToolButtonProps {
  imageData: ImageData;
}

function ToolButton({ imageData }: ToolButtonProps) {
  return (
    <Button color="info" onClick={() => saveToPng(imageData, 'output')}>
      Save Image
    </Button>
  );
}

function mapStateToProps(state: ReduxState) {
  return ({
    imageData: getImageData(state),
  });
}

export default connect(mapStateToProps)(ToolButton);