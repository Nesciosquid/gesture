import * as React from 'react';

import { Button } from 'reactstrap';
import './styles.scss';

interface AutoAdvanceSelectorProps {
    active: boolean;
    onClick: (advance: boolean) => void;
}

export default function AutoAdvanceSelector({ active, onClick}: AutoAdvanceSelectorProps) {
    return (
        <div className="auto-advance-selector">
            <div className="auto-advance-selector-label">
                Auto-advance
            </div>
            <div className="auto-advance-selector-button">
                <Button onClick={() => onClick(!active)} color={active ? 'primary' : 'secondary'}>
                    {active ? 'on ' : 'off'}
                </Button>
            </div>
        </div>
    );
}