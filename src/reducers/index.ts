import { combineReducers } from 'redux';
import images, { ImagesState } from './images';
import settings, { SettingsState } from './settings';
import { routerReducer, RouterState } from 'react-router-redux';

export interface ReduxState {
    images: ImagesState;
    settings: SettingsState;
    router: RouterState;
}

export default combineReducers<ReduxState>({
    images,
    settings,
    router: routerReducer
});