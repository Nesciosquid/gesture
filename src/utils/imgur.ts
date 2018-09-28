import { Album, AlbumImage } from './images';

const clientId = process.env.REACT_APP_IMGUR_CLIENT_ID;
export const IMGUR_SERVICE = 'imgur';

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

export class ImgurAlbum implements Album {
  data: ImgurAlbumData;
  images: ImgurAlbumImage[];

  constructor(data: ImgurAlbumData) {
    this.data = data;
    this.images = data.images.map(image => new ImgurAlbumImage(image));
  }

  getThumbnailUrl = () => this.images.length > 0 ? this.images[0].getThumbnailUrl() : 'NO_URL';
  getTitle = () => this.data.title;
  getId = () => this.data.id;
  getService = () => IMGUR_SERVICE;
  
  getImages = () => this.images;
  getError = () => this.data.error;
}

export class ImgurAlbumImage implements AlbumImage {
  data: ImgurImageData;

  constructor(data: ImgurImageData) {
    this.data = data;
  }

  getId = () => this.data.id;
  getUrl = () => getImageUrl(this.getId(), this.data.type, 'default');
  getThumbnailUrl = () => getImageUrl(this.getId(), this.data.type, 'smallThumbnail');
}

export async function getAlbum(albumId: string): Promise<ImgurAlbum> {
    const response = await fetch(`https://api.imgur.com/3/album/${albumId}`, fetchConfig);
    const json = await response.json();
    const albumData = json.data as ImgurAlbumData;
    return new ImgurAlbum(albumData);
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

export function getImageUrl(imageId: string, type: string, size: string): string {
    const fileExtension = type.split('/')[1];
    const sizeSuffix = imageSizes[size];
    return `${imageUrl}/${imageId}${sizeSuffix}.${fileExtension}`;
}

export interface ImgurImageData {
    id: string;
    sizes: {
        smallSquare: string,
        bigSquare: string,
        smallThumbnail: string,
        mediumThumbnail: string,
        largeThumbnail: string,
        hugeThumbnail: string,
        default: string
    };
}

export interface ImgurImageData {
    id: string;
    type: string;
}