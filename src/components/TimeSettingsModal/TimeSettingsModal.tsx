import * as React from 'react';

import { Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem } from 'reactstrap';
import ConnectedAdvanceTimeSelector from './ConnectedAdvanceTimeSelector/ConnectedAdvanceTimeSelector';
import ConnectedAutoAdvanceSelector from './ConnectedAutoAdvanceSelector/ConnectedAutoAdvanceSelector';

interface AlbumModalProps {
    toggle: () => void;
    isOpen: boolean;
}

export default function TimeSettingsModal({ isOpen, toggle }: AlbumModalProps) {
    return (
        <Modal 
            className="album-modal-dialog" 
            wrapClassName="album-modal-wrapper" 
            modalClassName="album-modal" 
            contentClassName="album-modal-content" 
            isOpen={isOpen}
            toggle={toggle}
        >
            <ModalHeader toggle={toggle}>Time Settings</ModalHeader>
            <ModalBody>
                <ListGroup>
                    <ListGroupItem>
                        <ConnectedAutoAdvanceSelector />
                    </ListGroupItem>
                    <ListGroupItem>
                        <ConnectedAdvanceTimeSelector 
                            options={[
                                {
                                    label: '15s',
                                    time: 15
                                },
                                {
                                    label: '30s',
                                    time: 30
                                },
                                {
                                    label: '60s',
                                    time: 60,
                                },
                                { 
                                    label: '120s',
                                    time: 120
                                }
                            ]}
                        />
                    </ListGroupItem>
                </ListGroup>
            </ModalBody>
        </Modal>
    );
}