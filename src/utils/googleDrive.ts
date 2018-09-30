import { Album, AlbumImage } from './images';

export const GOOGLE_DRIVE_SERVICE = 'drive';
const API_KEY = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY;

export async function initializeDriveService() {
  return new Promise((resolve, reject) => {
    gapi.load('client', () => { 
      gapi.client.load('drive', 'v3', () => {
        (gapi.client as any).init({ //tslint:disable-line
          apiKey: API_KEY
        }).then(() => {
            resolve();
        });
      });
    });
  });
}

const fileFields: string[] = [ 
  'thumbnailLink',
  'id',
  'name',
  'description',
  'createdTime',
  'webContentLink',
  'webViewLink',
  'mimeType'
];

export async function getAlbum(id: string): Promise<DriveAlbum> {
  const result = 
    await gapi.client.drive.files.list({ q: `'${id}' in parents`, fields: `files(${fileFields.join(',')})`});
  const albumResult = await gapi.client.drive.files.get({ fileId: id});
  let title: string;
  if (albumResult.result) {
    title = albumResult.result.name || id;
  } else {
    title = id;
  }
  let images: gapi.client.drive.File[];
  if (result.result.files) {
    images = result.result.files.filter(file => file.mimeType && file.mimeType.startsWith('image/'));      
  } else {
    images = [];
  }
  return new DriveAlbum(title, id, images);
}

export class DriveAlbum implements Album {
  images: DriveAlbumImage[];
  title: string;
  id: string;

  constructor(title: string, id: string, files: gapi.client.drive.File[]) {
    this.images = files.map(file => new DriveAlbumImage(file));
    this.title = title;
    this.id = id;
  }

  getThumbnailUrl = () => this.images.length > 0 ? this.images[0].getThumbnailUrl() : 'NO_URL';
  getTitle = () => this.title;
  getId = () => this.id;
  getService = () => GOOGLE_DRIVE_SERVICE;
  getImages = () => this.images;
}

export class DriveAlbumImage implements AlbumImage {
  file: gapi.client.drive.File;

  constructor(file: gapi.client.drive.File) {
    this.file = file;
  }

  getId = () => this.file.id || 'NO_ID';
  getUrl = () => this.file.webContentLink || 'NO_LINK';
  getThumbnailUrl = () => this.file.thumbnailLink || 'NO_LINK';
}