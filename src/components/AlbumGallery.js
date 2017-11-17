import React from 'react';
import { getImage } from '../utils/imgur';

export default function AlbumGallery({ images }) {
    const mappedImages = images ? images.map(getImage).map(image => 
        <img key={image.id} src={image.sizes.smallSquare} />
    ): null;
    return (
        <div>
            {mappedImages}
        </div>
    )
}