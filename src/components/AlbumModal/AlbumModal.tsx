import * as React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import ConnectedAlbumList from '../../components/ConnectedAlbumList/ConnectedAlbumList';
import ConnectedAlbumInput from './ConnectedAlbumInput/ConnectedAlbumInput';
import './styles.scss';

interface AlbumModalProps {
    toggle: () => void;
    isOpen: boolean;
}

export default function AlbumModal({ isOpen, toggle }: AlbumModalProps) {
    return (
        <Modal className="album-modal-dialog" wrapClassName="album-modal-wrapper" modalClassName="album-modal" contentClassName="album-modal-content" isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Loaded Albums</ModalHeader>
            <ModalBody>
                <ConnectedAlbumInput />
                <ConnectedAlbumList />
            </ModalBody>
        </Modal>
    );
}