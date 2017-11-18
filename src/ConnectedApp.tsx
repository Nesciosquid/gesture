import { connect } from 'react-redux';
import { ReduxState } from './reducers/index';
import { getAllImages } from './selectors/search';
import { fetchAlbumFromImgur } from './actions/images';
import App from './App';

function mapStateToProps(state: ReduxState) {
    return ({
        allImages: getAllImages(state) 
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