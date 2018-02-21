import { ReduxAction } from '../actions/index';
import { actionTypes } from '../actions/pressure';

export interface PressureState {
  change: {
    force: number;
    event: any; //tslint:disable-line
  };
}

export const DefaultPressureState = {
  change: {
    force: 0,
    event: undefined
  }
};

function setChange(state: PressureState, payload: { force: number, event: any }) { //tslint:disable-line
    return { ...state, change: payload };
}

export default function(state: PressureState = DefaultPressureState, {type, payload}: ReduxAction): PressureState {
    switch (type) {
        case (actionTypes.change): {
            return setChange(state, payload);
        }
        default: {
            return state;
        }
    }
}