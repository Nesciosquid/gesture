export interface Album {
  getId: () => string;
  getImages: () => AlbumImage[];
  getTitle: () => string;
  getThumbnailUrl: () => string;
  getService: () => string;
}

export interface AlbumImage {
  getId: () => string;
  getUrl: () => string;
  getThumbnailUrl: () => string;
}