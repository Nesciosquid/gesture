import * as React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import ConnectedAlbumList from '../../components/ConnectedAlbumList/ConnectedAlbumList';
import './styles.css';

interface AlbumModalProps {
    toggle: () => void;
    isOpen: boolean;
}

export default function AlbumModal({ isOpen, toggle }: AlbumModalProps) {
    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Loaded Albums</ModalHeader>
            <ModalBody>
                <ConnectedAlbumList />
            </ModalBody>
            <ModalFooter>
            <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}