import { connect } from 'react-redux';
import { fetchAlbumFromImgur, fetchAlbumFromGoogleDrive } from '../../../actions/images';
import AlbumInput from './AlbumInput/AlbumInput';

function mapDispatchToProps(dispatch: Function) {
    return ({
        fetchImgurAlbum: (albumId: string) => { dispatch(fetchAlbumFromImgur(albumId)); },
        fetchGoogleDriveAlbum: (albumId: string) => { dispatch(fetchAlbumFromGoogleDrive(albumId)); }
    });
}

export default connect(null, mapDispatchToProps)(AlbumInput);