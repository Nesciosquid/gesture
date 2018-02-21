import { combineReducers } from 'redux';
import images, { ImagesState } from './images';
import settings, { SettingsState } from './settings';
import pressure, { PressureState } from './pressure';
import { routerReducer, RouterState } from 'react-router-redux';
import canvas, { CanvasState } from './canvas';

export interface ReduxState {
    images: ImagesState;
    settings: SettingsState;
    router: RouterState;
    pressure: PressureState;
    canvas: CanvasState;
}

export default combineReducers<ReduxState>({
    images,
    settings,
    pressure,   
    canvas,
    router: routerReducer,
});