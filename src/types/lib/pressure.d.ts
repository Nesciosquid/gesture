declare module 'pressure' {
  function set(element: any, options: any): void;
  function map(value: number, min: number, max: number, rangeMin: number, rangeMax: number): number;
  export {
    set,
    map
  }
}