import * as React from 'react';
import { ImgurAlbumData } from '../../../../../utils/imgur';
import { ListGroupItem } from 'reactstrap';
import { Album } from '../../../../../utils/images';
import './styles.css';

export interface AlbumProps {
    album: Album;
    onClick: (selected: boolean) => void;
    selected: boolean;
}

export default function AlbumComponent({ album, onClick, selected }: AlbumProps) {
    const thumbnail = album.getThumbnailUrl();
    return (
        <ListGroupItem active={selected} onClick={() => onClick(!selected)}>
            <div className="album-container">
                <div className="album-container--left" >
                    <img src={thumbnail.toString()} />
                </div>
                <div className="album-container--right" >
                    <h4>{album.getTitle()}</h4>
                    <span>{album.getImages().length} images</span>
                </div>
            </div>
        </ListGroupItem>
    );
}