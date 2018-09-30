import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { ReduxState } from '../../reducers/index';
import { saveToPng } from '../../utils/canvas'; 

interface ToolButtonProps {
  imageData: ImageData;
}

export default function ToolButton({ imageData }: ToolButtonProps) {
  return (
    <Button color="info" onClick={() => saveToPng(imageData, 'output')}>
      Save Image
    </Button>
  );
}