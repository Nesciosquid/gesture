import { connect } from 'react-redux';
import { setAlbumSelection } from '../../../../actions/images';
import { isAlbumSelected } from '../../../../selectors/images';
import { ReduxState } from '../../../../reducers/';
import { ImgurAlbumData } from '../../../../utils/imgur';
import AlbumComponent from './Album/Album';
import { Album } from '../../../../utils/images';

interface ConnectedAlbumProps {
    album: Album;
}

function mapStateToProps(state: ReduxState, { album }: ConnectedAlbumProps) {
    const selected = isAlbumSelected(state, album.getId());
    return ({
        selected,
    });
}

function mapDispatchToProps(dispatch: Function, { album }: ConnectedAlbumProps) {
    return ({
        onClick: (selected: boolean) => { dispatch(setAlbumSelection(album.getId(), selected)); }
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumComponent);