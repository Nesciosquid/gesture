export const actionTypes = {
    change: 'PRESSURE//CHANGE'
};

export function setChange(force: number, event: any) { //tslint:disable-line
    return ({
        type: actionTypes.change,
        payload: {
          force,
          event
        }
    });
}