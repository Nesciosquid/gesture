import * as React from 'react';
import ConnectedAlbumList from '../../components/ConnectedAlbumList/ConnectedAlbumList';
import ConnectedAlbumInput from './ConnectedAlbumInput/ConnectedAlbumInput';

import './styles.scss';

interface AlbumModalProps {
    toggle: () => void;
    isOpen: boolean;
}

// TODO: Rename this if we're sticking with a full screen album selection view
export default function AlbumModal({ isOpen, toggle }: AlbumModalProps) {
    const isOpenClass = isOpen ? 'albumPanel albumPanel-isVisible' : 'albumPanel';

    return (
        <div
            className={isOpenClass}
        >   
            <div className="row">
                <h1 className="col-sm-8">Choose your albums</h1>
                <h4 
                    onClick={toggle} 
                    className="col-sm-4 text-right align-self-center close"
                >
                    <button className="btn btn-secondary">Close</button>
                </h4>
            </div>
            <ConnectedAlbumInput />
            <ConnectedAlbumList />
        </div>
    );
}