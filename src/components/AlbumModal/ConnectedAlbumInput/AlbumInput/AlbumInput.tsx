import * as React from 'react';
import { InputGroup, InputGroupButton, Input, Button } from 'reactstrap';
import './styles.css';

interface AlbumInputProps {
    onSubmit: (albumId: string) => void;
}

interface AlbumInputState {
    albumId: string;
}

export default class AlbumInput extends React.Component<AlbumInputProps, AlbumInputState> {
    constructor(props: AlbumInputProps) {
        super(props);
        this.state = {
            albumId: ''
        };
    }

    setAlbumId = (albumId: string) => {
        this.setState({
            albumId
        });
    }

    fetchAlbum = () => {
        this.props.onSubmit(this.state.albumId);
        this.setState({
            albumId: ''
        });
    }

    render() {
        return (
            <div className="album-input-container"> 
                <InputGroup>
                    <InputGroupButton>
                        <Button onClick={this.fetchAlbum}>
                            Add Imgur Album
                        </Button>
                    </InputGroupButton>
                    <Input 
                        placeholder="ABCDE" 
                        value={this.state.albumId} 
                        onChange={(event) => this.setAlbumId(event.target.value)} 
                    />
                </InputGroup>
            </div>
        );
    }

}