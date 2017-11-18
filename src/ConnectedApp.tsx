import { connect } from 'react-redux';
import { ReduxState } from './reducers/index';
import { getSelectedImages } from './selectors/images';
import { fetchAlbumFromImgur } from './actions/images';
import App from './App';

function mapStateToProps(state: ReduxState) {
    return ({
        allImages: getSelectedImages(state) 
    });
}

function mapDispatchToProps(dispatch: Function) {
    return ({
        fetchAlbum: (albumId: string) => {
            dispatch(fetchAlbumFromImgur(albumId));
        }
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(App);