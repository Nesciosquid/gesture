import * as React from 'react';
import { Input, Button } from 'reactstrap';
import * as cx from 'classnames';
import './styles.css';

interface AlbumInputProps {
    fetchImgurAlbum: (albumId: string) => void;
    fetchGoogleDriveAlbum: (albumId: string) => void;
}

interface AlbumInputState {
    imgurAlbumId: string;
    googleDriveAlbumId: string;
    visible: boolean;
}

export default class AlbumInput extends React.Component<AlbumInputProps, AlbumInputState> {
    constructor(props: AlbumInputProps) {
        super(props);
        this.state = {
            imgurAlbumId: '',
            googleDriveAlbumId: '',
            visible: false
        };
    }

    setGoogleDriveAlbumId = (albumId: string) => {
        this.setState({
            googleDriveAlbumId: albumId,
        });
    }

    setImgurAlbumId = (albumId: string) => {
        this.setState({
            imgurAlbumId: albumId,
        });
    }

    fetchImgurAlbum = () => {
        this.props.fetchImgurAlbum(this.state.imgurAlbumId);
        this.setImgurAlbumId('');

        this.setState({
            visible: false
        });
    }

    fetchGoogleDriveAlbum = () => {
        this.props.fetchGoogleDriveAlbum(this.state.googleDriveAlbumId);
        this.setGoogleDriveAlbumId('');
        
        this.setState({
            visible: false
        });
    }

    // TODO: Maybe move this visibility to the parent AlbumModal.tsx so that we can have the Add Album and Close buttons side by side
    toggleVisibility = () => {
        this.setState({
            visible: !this.state.visible
        });
    }

    render() {
        return (
            <div>
                <div className={cx("album-input-container", {'album-input-container-visible': this.state.visible})}> 
                    <div className="row">
                        <label className="col-sm-2 col-form-label">Imgur Album</label>
                        <div className="col-sm-8">
                            <Input 
                                placeholder="eg, ABCDE" 
                                value={this.state.imgurAlbumId} 
                                onChange={(event) => this.setImgurAlbumId(event.target.value)} 
                            />
                        </div>
                        <div className="col-sm-2">
                            <Button onClick={this.fetchImgurAlbum} className="btn-block">
                                Add
                            </Button>
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-sm-2 col-form-label">Drive Album</label>
                        <div className="col-sm-8">
                            <Input 
                                placeholder="eg, 12345" 
                                value={this.state.googleDriveAlbumId} 
                                onChange={(event) => this.setGoogleDriveAlbumId(event.target.value)} 
                            />
                        </div>
                        <div className="col-sm-2">
                            <Button onClick={this.fetchGoogleDriveAlbum} className="btn-block">
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={cx("album-input-toggle", {"album-input-toggle-visible": !this.state.visible})}> 
                    <button className="btn btn-secondary" onClick={this.toggleVisibility}>{this.state.visible ? 'Cancel' : 'Add Album'}</button>
                </div>
            </div>
        );
    }

}