import * as React from 'react';
import { InputGroup, InputGroupButton, Input, Button } from 'reactstrap';
import './styles.css';

interface AlbumInputProps {
    fetchImgurAlbum: (albumId: string) => void;
    fetchGoogleDriveAlbum: (albumId: string) => void;
}

interface AlbumInputState {
    imgurAlbumId: string;
    googleDriveAlbumId: string;
}

export default class AlbumInput extends React.Component<AlbumInputProps, AlbumInputState> {
    constructor(props: AlbumInputProps) {
        super(props);
        this.state = {
            imgurAlbumId: '',
            googleDriveAlbumId: '',
        };
    }

    setGoogleDriveAlbumId = (albumId: string) => {
      this.setState({
        googleDriveAlbumId: albumId
      });
    }

    setImgurAlbumId = (albumId: string) => {
        this.setState({
            imgurAlbumId: albumId
        });
    }

    fetchImgurAlbum = () => {
        this.props.fetchImgurAlbum(this.state.imgurAlbumId);
        this.setImgurAlbumId('');
    }

    fetchGoogleDriveAlbum = () => {
      this.props.fetchGoogleDriveAlbum(this.state.googleDriveAlbumId);
      this.setGoogleDriveAlbumId('');
    }

    render() {
        return (
            <div className="album-input-container"> 
                <InputGroup>
                    <InputGroupButton>
                        <Button onClick={this.fetchImgurAlbum}>
                            Add Imgur Album
                        </Button>
                    </InputGroupButton>
                    <Input 
                        placeholder="ABCDE" 
                        value={this.state.imgurAlbumId} 
                        onChange={(event) => this.setImgurAlbumId(event.target.value)} 
                    />
                </InputGroup>
                <InputGroup>
                    <InputGroupButton>
                        <Button onClick={this.fetchGoogleDriveAlbum}>
                            Add Google Drive Album
                        </Button>
                    </InputGroupButton>
                    <Input 
                        placeholder="12345" 
                        value={this.state.googleDriveAlbumId} 
                        onChange={(event) => this.setGoogleDriveAlbumId(event.target.value)} 
                    />
                </InputGroup>
            </div>
        );
    }

}