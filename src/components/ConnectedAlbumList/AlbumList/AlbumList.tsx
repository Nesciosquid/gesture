import * as React from 'react';
import { ImgurAlbumData } from '../../../utils/imgur';
import ConnectedAlbum from './ConnectedAlbum/ConnectedAlbum';
import { ListGroup } from 'reactstrap';
import { Album } from '../../../utils/images';

interface AlbumListProps {
    albums: Album[];
}

export default function AlbumList({albums}: AlbumListProps) {
    const albumItems = albums.map(album => {
        return (
            <ConnectedAlbum key={album.getId()} album={album} />            
        );
    });
    return (
        <ListGroup>
            {albumItems}
        </ListGroup>
    );
}