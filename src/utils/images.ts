export interface Album {
  getId: () => string;
  getImages: () => AlbumImage[];
  getTitle: () => string;
  getThumbnailUrl: () => string;
  getService: () => string;
  data?: any;
}

export interface AlbumImage {
  getId: () => string;
  getUrl: () => string;
  getThumbnailUrl: () => string;
}