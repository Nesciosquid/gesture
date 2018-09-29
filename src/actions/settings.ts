export const actionTypes = {
    setAdvanceTime: 'SET_ADVANCE_TIME',
    setAutoAdvance: 'SET_AUTO_ADVANCE'
};

export function setAdvanceTime(time: number) {
    return ({
        type: actionTypes.setAdvanceTime,
        payload: time
    });
}

export function setAutoAdvance(advance: boolean) {
    return ({
        type: actionTypes.setAutoAdvance,
        payload: advance
    });
}