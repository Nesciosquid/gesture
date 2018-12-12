import * as React from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import './styles.scss';

export interface ButtonOption {
    label: string;
    time: number;
}

export interface AdvanceTimeSelectorProps {
    options: ButtonOption[];
    onClickOption: (time: number) => void;
    advanceTime: number;
    active: boolean;
}

export default function({options, onClickOption, advanceTime, active}: AdvanceTimeSelectorProps) {
    const buttons = options.map((option, index) => (
        <Button
            key={index.toString()}
            active={active}
            onClick={() => onClickOption(option.time)}
            color={option.time === advanceTime ? 'primary' : 'secondary'}
        >
            {option.label}
        </Button>
    ));
    return (
        <div className="advance-time-selector">
            <div className="advance-time-label">
                Time
            </div>
            <div className="advance-time-buttons">
                <ButtonGroup>
                    {buttons}
                </ButtonGroup>
            </div>
        </div>
    );
}