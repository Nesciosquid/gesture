import { combineReducers } from 'redux';
import images, { ImagesState } from './images';
import settings, { SettingsState } from './settings';
import tools, { ToolsState } from './tools';
import { routerReducer, RouterState } from 'react-router-redux';
import canvas, { CanvasState } from './canvas';
import viewport, { ViewportState } from './viewport';
import performance, { PerformanceState } from './performance';

export interface ReduxState {
    images: ImagesState;
    settings: SettingsState;
    router: RouterState;
    tools: ToolsState;
    canvas: CanvasState;
    viewport: ViewportState;
    performance: PerformanceState;
}

export default combineReducers<ReduxState>({
    images,
    settings,
    tools,   
    canvas,
    viewport,
    performance,
    router: routerReducer,
});