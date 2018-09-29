import { ImgurAlbumData, getAlbum } from '../utils/imgur';
import * as drive from '../utils/googleDrive';
import { ReduxAction } from './';
import { Album } from '../utils/images';

export const actionTypes = {
    addAlbum: 'ADD_ALBUM',
    toggleAlbumSelection: 'TOGGLE_ALBUM_SELECTION',
    logError: 'LOG_ERROR'
};

export function addAlbum(album: Album | Promise<Album>): ReduxAction {
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

export function fetchAlbumFromGoogleDrive(albumId: string): Promise<ReduxAction> {
  return drive.getAlbum(albumId).then(album => {
    return addAlbum(album);
  });
}

export function fetchAlbumFromImgur(albumId: string): Promise<ReduxAction> {
    return getAlbum(albumId).then(album => {
      const error = album.getError();
      if (!error) {
          return addAlbum(album);            
      } else {
        return logError(error);          
      }
    });
}