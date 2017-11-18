import { combineReducers } from 'redux';
import images, { ImagesState } from './images';

export interface ReduxState {
    images: ImagesState;
}

export default combineReducers<ReduxState>({
    images
});