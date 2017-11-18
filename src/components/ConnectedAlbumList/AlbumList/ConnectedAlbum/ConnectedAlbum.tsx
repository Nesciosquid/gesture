import { connect } from 'react-redux';
import { setAlbumSelection } from '../../../../actions/images';
import { isAlbumSelected } from '../../../../selectors/images';
import { ReduxState } from '../../../../reducers/';
import { ImgurAlbumData } from '../../../../utils/imgur';
import Album from './Album/Album';

interface ConnectedAlbumProps {
    album: ImgurAlbumData;
}

function mapStateToProps(state: ReduxState, { album }: ConnectedAlbumProps) {
    const selected = isAlbumSelected(state, album.id);
    return ({
        selected,
    });
}

function mapDispatchToProps(dispatch: Function, { album }: ConnectedAlbumProps) {
    return ({
        onClick: (selected: boolean) => { dispatch(setAlbumSelection(album.id, selected)); }
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(Album);