import * as React from 'react';
import './App.scss';
import {  } from './utils/imgur';
import CircularProgressbar from 'react-circular-progressbar';
import AlbumModal from './components/AlbumModal/AlbumModal';
import TimeSettingsModal from './components/TimeSettingsModal/TimeSettingsModal';
import { AlbumImage } from './utils/images';

const defaultAdvanceTime = 60;

interface AppProps {
  allImages: AlbumImage[];
  fetchAlbum: (albumId: string) => void;
  advanceTime: number;  
  autoAdvance: boolean;
  setAutoAdvance: (advance: boolean) => void;
}

interface AppState {
  faded: boolean;
  albumId: string;
  currentImageIndex?: number;
  shuffledImages?: AlbumImage[];
  remainingTime: number;
  previousImages: AlbumImage[];
  error: boolean;
  timer: number;
  albumsModal: boolean;
  timeSettingsModal: boolean;
}

class App extends React.Component<AppProps, AppState>  {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      faded: false,
      albumId: '',
      albumsModal: false,
      timeSettingsModal: false,
      currentImageIndex: undefined,
      shuffledImages: undefined,
      remainingTime: defaultAdvanceTime,
      previousImages: [],
      error: false,
      timer: window.setInterval(this.timeTick, 1000)
    };
  }
  timeTick = () => {
    if (this.props.autoAdvance) {
      const remaining = this.state.remainingTime;
      const newTime = remaining - 1;
      if (newTime > 0 ) {
        this.setState({ remainingTime: newTime });
      } else {
        if (!this.state.faded) {
          this.advanceImage();
        }
      }
    }
  }
  logImage = (image: AlbumImage) => {
    const previousImages = this.state.previousImages.concat();
    previousImages.push(image);
    this.setState({
      previousImages
    });
  }
  componentDidUpdate(lastProps: AppProps) {
    if (lastProps.allImages.length !== this.props.allImages.length) {
      this.shuffleImages(this.props.allImages);
    }
  }
  getCurrentImage = () => {
    if (this.state.shuffledImages && this.state.currentImageIndex !== undefined 
      && this.state.shuffledImages.length > 0) {
      const image = this.state.shuffledImages[this.state.currentImageIndex];
      return image;
    } else { return null; }
  }
  advanceImage = () => {
    if (this.state.shuffledImages && this.state.currentImageIndex !== undefined) {
      const maxIndex = this.state.shuffledImages.length - 1;
      const nextIndex = this.state.currentImageIndex + 1;
      this.setState({
        faded: true,
        remainingTime: 0
      });
      setTimeout(
        () => {
          if (nextIndex > maxIndex) {
            this.shuffleImages(this.props.allImages);
          } else {
            this.setState({
              currentImageIndex: nextIndex,
            });
            setTimeout(
              () => {
                this.setState({
                  remainingTime: this.props.advanceTime,
                  faded: false,
                });
              },
              2000
            );
          }
        }, 
        15000
      );
    }
  }
  shuffleImages = (images: AlbumImage[]) => {
    this.setState({
      shuffledImages: images.sort(() => Math.random() - 0.5),
      currentImageIndex: 0,
      remainingTime: this.props.advanceTime
    });
  }
  updateAlbumId = (id: string) => {
    this.setState({ albumId: id });
  }
  updateAlbum = () => {
    this.props.fetchAlbum(this.state.albumId);
    this.setState({ albumId: '' });
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
    let imageClass = 'hero-image';
    if (this.state.faded) {
      imageClass += ' faded';
    }
    if (!current) {
      return null;
    } 

    return <img src={current.getUrl().toString()} className={imageClass} />;  
  }
  toggleAlbumsModal = () => {
    this.setState({
      albumsModal: !this.state.albumsModal
    });
  }
  toggleTimeSettingsModal = () => {
    this.setState({
      timeSettingsModal: !this.state.timeSettingsModal
    });
  }
  getProgressPercentage = () => {
    return 100 * ((this.props.advanceTime - this.state.remainingTime) / this.props.advanceTime);
  }
  render() {
    return (
      <div className="App">
        <div className="hero-image-container">
          {this.getHeroImage()}
        </div>
        <div className="control-buttons">
          <div className="skip-button" onClick={this.advanceImage}>
            <i className="material-icons">skip_next</i>
          </div>
          <div 
            className="play-pause-button" 
            onClick={() => this.props.setAutoAdvance(!this.props.autoAdvance)}
          >
            <i className="material-icons">{this.props.autoAdvance ? 'pause' : 'play_arrow'}</i>
          </div>
          <div className="albums-icon" onClick={this.toggleAlbumsModal}>
            <i className="material-icons">collections</i>          
          </div>
          <div onClick={this.toggleTimeSettingsModal} className="circle-progress">
            <CircularProgressbar 
              percentage={this.getProgressPercentage()} 
              textForPercentage={() => `${this.state.remainingTime}s`}  
            />
          </div>
          <TimeSettingsModal isOpen={this.state.timeSettingsModal} toggle={this.toggleTimeSettingsModal} />
          <AlbumModal isOpen={this.state.albumsModal} toggle={this.toggleAlbumsModal} />
        </div>
      </div>
    );
  }
}

export default App;
