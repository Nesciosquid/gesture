import * as React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import ConnectedAlbumList from '../../components/ConnectedAlbumList/ConnectedAlbumList';

interface AlbumModalProps {
    toggle: () => void;
    isOpen: boolean;
}

export default function AlbumModal({ isOpen, toggle }: AlbumModalProps) {
    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Modal title</ModalHeader>
            <ModalBody>
                <ConnectedAlbumList />
            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
            <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}