import { connect } from 'react-redux';
import { ReduxState } from '../../reducers/';
import { getAllAlbums } from '../../selectors/images';
import AlbumList from './AlbumList/AlbumList';

function mapStateToProps(state: ReduxState) {
    return ({
        albums: getAllAlbums(state)
    });
}

export default connect(mapStateToProps)(AlbumList);