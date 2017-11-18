const clientId = process.env.REACT_APP_IMGUR_CLIENT_ID;

const fetchConfig: RequestInit = {
    method: 'get',
    headers: new Headers({ Authorization: `Client-ID ${clientId}`})
};

const imageUrl = 'https://i.imgur.com';

export interface ImgurAlbumData {
    id: string;
    title: string;
    description: string;
    datetime: string;
    cover: string;
    images: ImgurImageData[];
    error?: string;
}

export function getAlbum(albumId: string) {
    return fetch(`https://api.imgur.com/3/album/${albumId}`, fetchConfig)
        .then(response => response.json())
        .then(result => result.data as ImgurAlbumData);    
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

export function getImageUrl(imageId: string, type: string, size: string): URL {
    const fileExtension = type.split('/')[1];
    const sizeSuffix = imageSizes[size];
    return new URL(`${imageUrl}/${imageId}${sizeSuffix}.${fileExtension}`);
}

export interface Image {
    id: string;
    sizes: {
        smallSquare: URL,
        bigSquare: URL,
        smallThumbnail: URL,
        mediumThumbnail: URL,
        largeThumbnail: URL,
        hugeThumbnail: URL,
        default: URL
    };
}

export interface ImgurImageData {
    id: string;
    type: string;
}

export function getImage(imageData: ImgurImageData): Image {
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
    };
}