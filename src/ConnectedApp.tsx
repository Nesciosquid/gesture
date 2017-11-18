import { connect } from 'react-redux';
import { ReduxState } from './reducers/index';
import { getSelectedImages } from './selectors/images';
import { fetchAlbumFromImgur } from './actions/images';
import defaultAlbums from './utils/defaultAlbums';
import App from './App';
import { getAdvanceTime, getAutoAdvance } from './selectors/settings';

function mapStateToProps(state: ReduxState) {
    return ({
        allImages: getSelectedImages(state),
        advanceTime: getAdvanceTime(state),
        autoAdvance: getAutoAdvance(state)
    });
}

function mapDispatchToProps(dispatch: Function) {
    return ({
        fetchAlbum: (albumId: string) => {
            dispatch(fetchAlbumFromImgur(albumId));
        },
        loadAlbums: () => { 
            defaultAlbums.forEach(albumId => dispatch(fetchAlbumFromImgur(albumId)));
        }
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(App);