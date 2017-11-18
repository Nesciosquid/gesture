import { connect } from 'react-redux';
import { fetchAlbumFromImgur } from '../../../actions/images';
import AlbumInput from './AlbumInput/AlbumInput';

function mapDispatchToProps(dispatch: Function) {
    return ({
        onSubmit: (albumId: string) => { fetchAlbumFromImgur(albumId); }
    });
}

export default connect(null, mapDispatchToProps)(AlbumInput);