import * as React from 'react';
import { ImgurAlbumData } from '../../../utils/imgur';
import ConnectedAlbum from './ConnectedAlbum/ConnectedAlbum';
import { ListGroup } from 'reactstrap';

interface AlbumListProps {
    albums: ImgurAlbumData[];
}

export default function AlbumList({albums}: AlbumListProps) {
    const albumItems = albums.map(album => {
        return (
            <ConnectedAlbum key={album.id} album={album} />            
        );
    });
    return (
        <ListGroup>
            {albumItems}
        </ListGroup>
    );
}