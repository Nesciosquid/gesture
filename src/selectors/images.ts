import { ReduxState } from '../reducers/';
import { ImgurAlbumData, ImgurImageData } from '../utils/imgur';

export function getAllImages(state: ReduxState) {
    return getImagesFromAlbums(state.images.albums);
}

export function getImagesFromAlbums(albums: ImgurAlbumData[]) {
    const reduceFunction = (accumulator: ImgurImageData[], currentValue: ImgurAlbumData) =>
        accumulator.concat(currentValue.images);
    return albums.reduce(reduceFunction, []);
}

export function getSelectedImages(state: ReduxState) {
    return getImagesFromAlbums(getSelectedAlbums(state));
}

export function isAlbumSelected(state: ReduxState, albumId: string) {
    return state.images.selectedAlbums.indexOf(albumId) > -1;
}

export function getAllAlbums(state: ReduxState) {
    return state.images.albums;
}

export function getSelectedAlbums(state: ReduxState) {
    return state.images.albums.filter(album => state.images.selectedAlbums.indexOf(album.id) > -1);
}