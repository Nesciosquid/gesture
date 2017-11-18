import * as React from 'react';
import './App.scss';
import { getImage, ImgurImageData } from './utils/imgur';
import { Button } from 'reactstrap';
import CircularProgressbar from 'react-circular-progressbar';
import AlbumModal from './components/AlbumModal/AlbumModal';

const defaultAdvanceTime = 60;

interface AppProps {
  allImages: ImgurImageData[];
  loadAlbums: () => void;
  fetchAlbum: (albumId: string) => void;
}

interface AppState {
  albumId: string;
  currentImageIndex?: number;
  shuffledImages?: ImgurImageData[];
  autoAdvance: boolean;
  advanceTime: number;
  remainingTime: number;
  previousImages: ImgurImageData[];
  error: boolean;
  timer: number;
  modal: boolean;
}

class App extends React.Component<AppProps, AppState>  {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      albumId: '',
      modal: false,
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
  componentDidUpdate(lastProps: AppProps) {
    if (lastProps.allImages !== this.props.allImages) {
      this.shuffleImages(this.props.allImages);
    }
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
        this.shuffleImages(this.props.allImages);
      } else {
        this.setState({
          currentImageIndex: nextIndex,
          remainingTime: this.state.advanceTime
        });
      }
    }
  }
  shuffleImages = (images: ImgurImageData[]) => {
    this.setState({
      shuffledImages: images.sort(() => Math.random() - 0.5),
      currentImageIndex: 0,
      remainingTime: this.state.advanceTime
    });
  }
  updateAlbumId = (id: string) => {
    this.setState({ albumId: id });
  }
  updateAlbum = () => {
    this.props.fetchAlbum(this.state.albumId);
    this.setState({ albumId: '' });
  }
  toggleAutoAdvance = () => {
    this.setState({
      autoAdvance: !this.state.autoAdvance
    });
  }
  componentDidMount() {
    this.props.loadAlbums();
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
    if (!current) {
      return null;
    } 

    return <img src={current.sizes.default.href} className="hero-image" />;  
  }
  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  }
  getProgressPercentage = () => {
    return 100 * ((this.state.advanceTime - this.state.remainingTime) / this.state.advanceTime);
  }
  render() {
    return (
      <div className="App">
        <div className="hero-image-container">
          {this.getHeroImage()}
        </div>
        <div className="image-footer">
          <Button onClick={this.advanceImage}>Advance</Button>
          <Button onClick={this.toggleModal}>Albums </Button>
          <input
            name="autoAdvance"
            type="checkbox"
            checked={this.state.autoAdvance}
            onChange={this.toggleAutoAdvance}
          />
          <AlbumModal isOpen={this.state.modal} toggle={this.toggleModal} />
        </div>
        <div className="circle-progress">
            <CircularProgressbar 
              percentage={this.getProgressPercentage()} 
              textForPercentage={() => `${this.state.remainingTime}s`}  
            />
          </div>
      </div>
    );
  }
}

export default App;
