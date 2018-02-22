import * as React from 'react';
import DrawingCanvas from './DrawingCanvas';
import ToolsPanel from './ToolsPanel';
import './Drawing.scss';

export default function CanvasApp() {
  return(
    <div className="drawing-app">
      <div className="tools-container">
        <ToolsPanel />
      </div>
      <div className="canvas-container">
        <DrawingCanvas />
      </div>
    </div>
  );
}