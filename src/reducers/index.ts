import { combineReducers } from 'redux';
import images, { ImagesState } from './images';
import settings, { SettingsState } from './settings';
import tools, { ToolsState } from './tools';
import { routerReducer, RouterState } from 'react-router-redux';
import canvas, { CanvasState } from './canvas';
import viewport, { ViewportState } from './viewport';

export interface ReduxState {
    images: ImagesState;
    settings: SettingsState;
    router: RouterState;
    tools: ToolsState;
    canvas: CanvasState;
    viewport: ViewportState;
}

export default combineReducers<ReduxState>({
    images,
    settings,
    tools,   
    canvas,
    viewport,
    router: routerReducer,
});