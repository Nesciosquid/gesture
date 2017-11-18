import { ImgurAlbumData, getAlbum } from '../utils/imgur';
import { ReduxAction } from './';

export const actionTypes = {
    addAlbum: 'ADD_ALBUM',
    toggleAlbumSelection: 'TOGGLE_ALBUM_SELECTION',
    logError: 'LOG_ERROR'
};

export function addAlbum(album: ImgurAlbumData | Promise<ImgurAlbumData>): ReduxAction {
    return ({
        type: actionTypes.addAlbum,
        payload: album
    });
}

export function setAlbumSelection(albumId: string, selected: boolean) {
    return ({
        type: actionTypes.toggleAlbumSelection,
        payload: {
            albumId,
            selected
        }
    });
}

export function logError(error: string) {
    return ({
        type: actionTypes.logError,
        payload: error
    });
}

export function fetchAlbumFromImgur(albumId: string): Promise<ReduxAction> {
    return getAlbum(albumId).then(album => {
        if (!album.error) {
            return addAlbum(album);            
        } 
        return logError(album.error);
    });
}