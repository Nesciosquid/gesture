import { ImgurAlbumData } from '../utils/imgur';
import { ReduxAction } from '../actions/';
import { actionTypes } from '../actions/images';

export interface ImagesState {
    albums: ImgurAlbumData[];
    selectedAlbums: string[];
}

export const DefaultImagesState = {
    albums: [],
    selectedAlbums: []
};

function addAlbum(state: ImagesState, album: ImgurAlbumData): ImagesState {
    return { ...state, albums: [...state.albums, album] };
}

export default function ImageReducer(state: ImagesState = DefaultImagesState, action: ReduxAction): ImagesState {
    switch (action.type) {
        case (actionTypes.addAlbum): 
            return addAlbum(state, action.payload);
        default: return state;
    }
}