import { combineReducers } from 'redux';
import images, { ImagesState } from './images';
import settings, { SettingsState } from './settings';

export interface ReduxState {
    images: ImagesState;
    settings: SettingsState;
}

export default combineReducers<ReduxState>({
    images,
    settings
});