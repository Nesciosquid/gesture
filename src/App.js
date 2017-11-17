import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { getAlbum, getImage } from './utils/imgur';
import AlbumGallery from './components/AlbumGallery';

const defaultAdvanceTime = 5;

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      album: null,
      albumId: 'BOEKC',
      currentImageIndex: null,
      shuffledImages: null,
      autoAdvance: true,
      advanceTime: defaultAdvanceTime,
      remainingTime: defaultAdvanceTime,
      previousImages: [],
      error: false,
      timer: setInterval(this.timeTick, 1000)
    }
  }
  timeTick = () => {
    if (this.state.autoAdvance) {
      const remaining = this.state.remainingTime;
      const advance = this.state.advanceTime;
      const newTime = remaining - 1;
      if (newTime > 0 ) {
        this.setState({ remainingTime: newTime });
      } else {
        this.advanceImage();
      }
    }
  }
  logImage = (image) => {
    this.setState({
      previousImages: this.state.previousImages.concat().push(image)
    })
  }
  getCurrentImage = () => {
    if (this.state.shuffledImages && this.state.shuffledImages.length > 0) {
      return getImage(this.state.shuffledImages[this.state.currentImageIndex]);
    } else return null;
  }
  advanceImage = () => {
    const maxIndex = this.state.shuffledImages.length -1;
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
  shuffleImages = () => {
    this.setState({
      shuffledImages: this.state.album.images.sort(() => Math.random() - 0.5),
      currentImageIndex: 0,
      remainingTime: this.state.advanceTime
    })
  }
  updateAlbumId = (id) => {
    this.setState({ albumId: id });
  }
  updateAlbum = () => {
    getAlbum(this.state.albumId)
    .then(album => {
      if (album.error) {
        this.setState({
          album: null,
          shuffledImages: null,
          error: true,
          autoAdvance: false,
        })
      } else {
        this.setState({ album, error: false }, this.shuffleImages);
      }
    })
  }
  toggleAutoAdvance = () => {
    this.setState({
      autoAdvance: !this.state.autoAdvance
    })
  }
  componentDidMount = () => {
    this.updateAlbum();
  }
  componentWillUnmount = () => {
    clearInterval(this.state.timer);
  }
  getAllImages = () => {
    return this.state.shuffledImages ? this.state.shuffledImages : []
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
      return <div style={{ backgroundImage: `url(${current.sizes.default})` }} className="hero-image" />
    } else return null;
  }
  render = () => {
    return (
      <div className="App">
        <div className="hero-image-container">
          {this.getHeroImage()}
        </div>
        <div className="image-footer">
          <button onClick={this.advanceImage}>Advance {this.state.remainingTime} / {this.state.advanceTime} </button>
          Album Id: <input type='text' value={this.state.albumId} onChange={(event) => this.updateAlbumId(event.target.value)} />
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
