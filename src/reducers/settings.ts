import { ReduxAction } from '../actions/index';
import { actionTypes } from '../actions/settings';

export interface SettingsState {
    advanceTime: number;
    autoAdvance: boolean;
}

export const DefaultSettingsState = {
    advanceTime: 60,
    autoAdvance: true,
};

function setAdvanceTime(state: SettingsState, advanceTime: number) {
    return { ...state, advanceTime };
}

function setAutoAdvance(state: SettingsState, autoAdvance: boolean) {
    return { ...state, autoAdvance };
}

export default function(state: SettingsState = DefaultSettingsState, {type, payload}: ReduxAction): SettingsState {
    switch (type) {
        case (actionTypes.setAdvanceTime): {
            return setAdvanceTime(state, payload);
        }
        case (actionTypes.setAutoAdvance): {
            return setAutoAdvance(state, payload);
        }
        default: {
            return state;
        }
    }
}