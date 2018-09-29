import { ImgurAlbumData } from '../utils/imgur';
import { ReduxAction } from '../actions/';
import { actionTypes } from '../actions/images';
import { Album } from '../utils/images';

export interface ImagesState {
    albums: Album[];
    selectedAlbums: string[];
}

export const DefaultImagesState = {
    albums: [],
    selectedAlbums: []
};

function addAlbum(state: ImagesState, album: Album): ImagesState {
  if (state.albums.filter(stateAlbum => stateAlbum.getId() === album.getId()).length === 0) {
      const albums = [...state.albums, album];
      const selectedAlbums = [...state.selectedAlbums, album.getId()];
      
      return { ...state, albums, selectedAlbums };
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

export default function ImageReducer(
    state: ImagesState = DefaultImagesState, {type, payload}: ReduxAction
): ImagesState {
  switch (type) {
      case (actionTypes.addAlbum): 
          return addAlbum(state, payload);
      case (actionTypes.toggleAlbumSelection):
          return setAlbumSelection(state, payload.albumId, payload.selected);
      default: return state;
  }
}