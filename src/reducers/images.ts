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
    if (state.albums.filter(stateAlbum => stateAlbum.id === album.id).length === 0) {
        return { ...state, albums: [...state.albums, album] };
    } 
    return state;
}

function setAlbumSelection(state: ImagesState, albumId: string, selected: boolean): ImagesState {
    if (selected) {
        const newSelections = state.selectedAlbums.concat();
        newSelections.push(albumId);
        return { ...state, selectedAlbums: newSelections };
    } 
    return { ...state, selectedAlbums: state.selectedAlbums.filter(id => id !== albumId )};
}

export default function ImageReducer(state: ImagesState = DefaultImagesState, {type, payload}: ReduxAction): ImagesState {
    switch (type) {
        case (actionTypes.addAlbum): 
            return addAlbum(state, payload);
        case (actionTypes.toggleAlbumSelection):
            return setAlbumSelection(state, payload.albumId, payload.selected);
        default: return state;
    }
}