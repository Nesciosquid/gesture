declare module 'cardinal-spline-js' {
  function getCurvePoints(points: number[], tenion?: number, segments?: number, closed?: boolean): number[];
  export {
    getCurvePoints
  };
}