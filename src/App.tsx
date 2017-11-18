import * as React from 'react';
import './App.css';
import { getAlbum, getImage, ImgurAlbumData, ImgurImageData } from './utils/imgur';

const defaultAdvanceTime = 5;

interface AppState {
  album?: ImgurAlbumData;
  albumId: string;
  currentImageIndex?: number;
  shuffledImages?: ImgurImageData[];
  autoAdvance: boolean;
  advanceTime: number;
  remainingTime: number;
  previousImages: ImgurImageData[];
  error: boolean;
  timer: number;
}

class App extends React.Component<{}, AppState>  {
  constructor(props: {}) {
    super(props);
    this.state = {
      album: undefined,
      albumId: 'BOEKC',
      currentImageIndex: undefined,
      shuffledImages: undefined,
      autoAdvance: true,
      advanceTime: defaultAdvanceTime,
      remainingTime: defaultAdvanceTime,
      previousImages: [],
      error: false,
      timer: window.setInterval(this.timeTick, 1000)
    };
  }
  timeTick = () => {
    if (this.state.autoAdvance) {
      const remaining = this.state.remainingTime;
      const newTime = remaining - 1;
      if (newTime > 0 ) {
        this.setState({ remainingTime: newTime });
      } else {
        this.advanceImage();
      }
    }
  }
  logImage = (image: ImgurImageData) => {
    const previousImages = this.state.previousImages.concat();
    previousImages.push(image);
    this.setState({
      previousImages
    });
  }
  getCurrentImage = () => {
    if (this.state.shuffledImages && this.state.currentImageIndex !== undefined && this.state.shuffledImages.length > 0) {
      const image = getImage(this.state.shuffledImages[this.state.currentImageIndex]);
      return image;
    } else { return null; }
  }
  advanceImage = () => {
    if (this.state.shuffledImages && this.state.currentImageIndex !== undefined) {
      const maxIndex = this.state.shuffledImages.length - 1;
      const nextIndex = this.state.currentImageIndex + 1;
      if (nextIndex > maxIndex) {
        this.shuffleImages();
      } else {
        this.setState({
          currentImageIndex: nextIndex,
          remainingTime: this.state.advanceTime
        });
      }
    }
  }
  shuffleImages = () => {
    if (this.state.album) {
      this.setState({
        shuffledImages: this.state.album.images.sort(() => Math.random() - 0.5),
        currentImageIndex: 0,
        remainingTime: this.state.advanceTime
      });
    }
  }
  updateAlbumId = (id: string) => {
    this.setState({ albumId: id });
  }
  updateAlbum = () => {
    getAlbum(this.state.albumId)
    .then(album => {
      if (album.error) {
        this.setState({
          album: undefined,
          shuffledImages: undefined,
          error: true,
          autoAdvance: false,
        });
      } else {
        this.setState({ album, error: false }, this.shuffleImages);
      }
    });
  }
  toggleAutoAdvance = () => {
    this.setState({
      autoAdvance: !this.state.autoAdvance
    });
  }
  componentDidMount() {
    this.updateAlbum();
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }
  getAllImages = () => {
    return this.state.shuffledImages ? this.state.shuffledImages : [];
  }
  getHeroImage = () =>  {
    const current = this.getCurrentImage();
    if (this.state.error) {
      return (
        <div className="error">
          Unable to load album: {this.state.albumId} 
        </div>
      );
    }
    if (current) {
      return <div style={{ backgroundImage: `url(${current.sizes.default})` }} className="hero-image" />;
    } else { return null; }
  }
  render() {
    return (
      <div className="App">
        <div className="hero-image-container">
          {this.getHeroImage()}
        </div>
        <div className="image-footer">
          <button onClick={this.advanceImage}>Advance {this.state.remainingTime} / {this.state.advanceTime} </button>
          Album Id: <input type="text" value={this.state.albumId} onChange={(event) => this.updateAlbumId(event.target.value)} />
          <button onClick={this.updateAlbum}>Update album </button>
          <input
            name="autoAdvance"
            type="checkbox"
            checked={this.state.autoAdvance}
            onChange={this.toggleAutoAdvance}
          />
        </div>
      </div>
    );
  }
}

export default App;
