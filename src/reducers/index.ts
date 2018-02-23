import { combineReducers } from 'redux';
import images, { ImagesState } from './images';
import settings, { SettingsState } from './settings';
import tools, { ToolsState } from './tools';
import { routerReducer, RouterState } from 'react-router-redux';
import canvas, { CanvasState } from './canvas';

export interface ReduxState {
    images: ImagesState;
    settings: SettingsState;
    router: RouterState;
    tools: ToolsState;
    canvas: CanvasState;
}

export default combineReducers<ReduxState>({
    images,
    settings,
    tools,   
    canvas,
    router: routerReducer,
});