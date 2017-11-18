import { ImgurAlbumData, getAlbum } from '../utils/imgur';
import { ReduxAction } from './';

export const actionTypes = {
    addAlbum: 'ADD_ALBUM'
};

export function addAlbum(album: ImgurAlbumData | Promise<ImgurAlbumData>): ReduxAction {
    return ({
        type: actionTypes.addAlbum,
        payload: album
    });
}

export function fetchAlbumFromImgur(albumId: string): Promise<ReduxAction> {
    return getAlbum(albumId).then(album => {
        return addAlbum(album);
    });
}