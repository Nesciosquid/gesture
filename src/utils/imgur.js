const clientId = process.env.REACT_APP_IMGUR_CLIENT_ID;

const fetchConfig = {
    method: 'get',
    headers: {
        Authorization: `Client-ID ${clientId}`
    }
};

const imageUrl = 'https://i.imgur.com';

export function getAlbum(albumId) {
    return fetch(`https://api.imgur.com/3/album/${albumId}`, fetchConfig)
        .then(response => response.json())
        .then(result => result.data);    
}

export const imageSizes = {
    smallSquare: 's',
    bigSquare: 'b',
    smallThumbnail: 't',
    mediumThumbnail: 'm',
    largeThumbnail: 'l',
    hugeThumbnail: 'h',
    default: ''
};

export function getImageUrl(imageId, type, size) {
    const fileExtension = type.split('/')[1];
    const sizeSuffix = imageSizes[size];
    return `${imageUrl}/${imageId}${sizeSuffix}.${fileExtension}`;
}

export function getImage(imageData) {
    const { id, type } = imageData;
    return {
        id,
        sizes: {
            smallSquare: getImageUrl(id, type, 'smallSquare'),
            bigSquare: getImageUrl(id, type, 'bigSquare'),
            smallThumbnail: getImageUrl(id, type, 'smallThumbnail'),
            mediumThumbnail: getImageUrl(id, type, 'mediumThumbnail'),
            largeThumbnail: getImageUrl(id, type, 'largeThumbnail'),
            hugeThumbnail: getImageUrl(id, type, 'hugeThumbnail'),
            default: getImageUrl(id, type, 'default'),
        }
    }
}