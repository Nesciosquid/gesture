import { ReduxState } from '../reducers/';

export function getAdvanceTime(state: ReduxState) {
    return state.settings.advanceTime;
}

export function getAutoAdvance(state: ReduxState) {
    return state.settings.autoAdvance;
}