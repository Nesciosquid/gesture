import { ReduxState } from '../reducers/';
import { createSelector } from 'reselect';

export const getPerformance = (state: ReduxState) => {
  return state.performance;
};

export const getLogs = createSelector(getPerformance, (performance) => {
  return performance.logs;
});

export const getAverageLog = createSelector(getLogs, (logs) => {
  if (logs.length > 0) {
    return logs.reduce((prev, cur) => prev + cur, 0) / logs.length;    
  } else {
    return -1;
  }
});

export const getSamples = createSelector(getPerformance, (performance) => {
  return performance.samples;
});

export const getSampleStartTime = createSelector(getPerformance, (performance) => {
  return performance.samplingStart;
});

export const getSampleEndTime = createSelector(getPerformance, (performance) => {
  return performance.samplingEnd;
});

export const getSampleRate = createSelector(getSamples, getSampleStartTime, getSampleEndTime, (samples, start, end) => {
  const endTime = end ? end : Date.now();
  const startTime = start ? start : Date.now();
  const duration = endTime - startTime;
  const rate = (samples / duration) * 1000; 
  return rate;
});