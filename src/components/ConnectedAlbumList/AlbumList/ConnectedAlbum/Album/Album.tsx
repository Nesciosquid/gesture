import * as React from 'react';
import { ImgurAlbumData, getImage } from '../../../../../utils/imgur';
import { ListGroupItem } from 'reactstrap';
import './styles.css';

export interface AlbumProps {
    album: ImgurAlbumData;
    onClick: (selected: boolean) => void;
    selected: boolean;
}

export default function Album({ album, onClick, selected }: AlbumProps) {
    const firstImage = getImage(album.images[0]);
    return (
        <ListGroupItem active={selected} onClick={() => onClick(!selected)}>
            <div className="album-container">
                <div className="album-container--left" >
                    <img src={firstImage.sizes.smallSquare.href} />
                </div>
                <div className="album-container--right" >
                    {album.title}
                </div>
            </div>
        </ListGroupItem>
    );
}