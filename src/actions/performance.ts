export const actionTypes = {
  startLog: 'PERFORMANCE//START_LOG',
  stopLog: 'PERFORMANCE//STOP_LOG',
  startSampling: 'PERFORMANCE//START_SAMPLING',
  stopSampling: 'PERFORMANCE//STOP_SAMPLING',
  addSample: 'PERFORMANCE//ADD_SAMPLE'
};

export function startLog() {
  return ({
    type: actionTypes.startLog
  });
}

export function stopLog() {
  return ({
    type: actionTypes.stopLog
  });
}

export function startSampling() {
  return ({
    type: actionTypes.startSampling
  });
}

export function stopSampling() {
  return ({
    type: actionTypes.stopSampling
  });
}

export function addSample() {
  return ({
    type: actionTypes.addSample
  });
}