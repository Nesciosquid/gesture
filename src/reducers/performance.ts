import { actionTypes } from '../actions/performance';
import { ReduxAction } from '../actions/index';

export interface PerformanceState {
  logs: number[];
  lastLogStart?: number;
  samplingStart?: number;
  samplingEnd?: number;
  samples: number;
}

export const DefaultPerformanceState: PerformanceState =  {
  logs: [],
  samples: 0,
};

function startSampling(state: PerformanceState): PerformanceState {
  console.log('starting sampling');
  return { ...state, samples: 0, samplingStart: Date.now(), samplingEnd: undefined };
}

function stopSampling(state: PerformanceState): PerformanceState {
  console.log('stopping sampling');  
  return { ...state, samplingEnd: Date.now() };
}

function addSample(state: PerformanceState): PerformanceState {
  console.log('adding sample');
  return { ...state, samples: state.samples + 1 };
}

function startLog(state: PerformanceState): PerformanceState {
  return { ...state, lastLogStart: Date.now() };
}

function stopLog(state: PerformanceState): PerformanceState {
  if (state.lastLogStart) {
    const duration = Date.now() - state.lastLogStart;
    const newLogs = state.logs.slice().concat([duration]);
    return { ...state, lastLogStart: undefined, logs: newLogs };    
  } else {
    return { ... state };
  }
}

export default function(state: PerformanceState = DefaultPerformanceState, {type, payload}: ReduxAction): 
  PerformanceState {
  switch (type) {
      case (actionTypes.startLog): {
          return startLog(state);
      }
      case (actionTypes.stopLog): {
          return stopLog(state);
      }
      case (actionTypes.startSampling): {
        return startSampling(state);
      }
      case (actionTypes.stopSampling): {
        return stopSampling(state);
      }
      case (actionTypes.addSample): {
        return addSample(state);
      }
      default: {
          return state;
      }
  }
}