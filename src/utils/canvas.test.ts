/**
 * @jest-environment jsdom
 */

import { getBounds, ImageDataWrapper, DrawBounds, getPartialImageData, putPartialImageData } from './canvas';

describe('putPartialImageData', () => {
  const image: ImageDataWrapper = {
    width: 3,
    height: 3,
    data: new Uint8ClampedArray(36)
  };
  const expectedData = new Uint8ClampedArray([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ]);
  const partialData = {
    data: new Uint8ClampedArray([1, 1, 1, 1]),
    width: 1,
    height: 1
  };
  const bounds: DrawBounds = {
    minX: 1,
    maxX: 2,
    minY: 1,
    maxY: 2,
    width: 1,
    height: 1
  };
  const result = putPartialImageData(image, partialData, bounds);
  expect(result.data).toEqual(expectedData);
  expect(result.width).toEqual(image.width);
  expect(result.height).toEqual(image.height);
});
describe('getPartialImageData', () => {
  it('returns the correct 1x1 image data out of a 3x3 image', () => {
    const image: ImageDataWrapper = {
        width: 3,
        height: 3,
        data: new Uint8ClampedArray([
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ])
    };
    const bounds: DrawBounds = {
      minX: 1,
      maxX: 2,
      minY: 1,
      maxY: 2,
      width: 1,
      height: 1
    };
    const data = getPartialImageData(image, bounds);
    expect(data.data.length).toBe(4);
    data.data.forEach(datum => {
      expect(datum).toEqual(1);
    }); 
  });
  it('returns the correct 2x1 image data out of a 3x3 image', () => {
    const image: ImageDataWrapper = {
        width: 3,
        height: 3,
        data: new Uint8ClampedArray([
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ])
    };
    const bounds: DrawBounds = {
      minX: 0,
      maxX: 2,
      minY: 1,
      maxY: 2,
      width: 2,
      height: 1
    };
    const data = getPartialImageData(image, bounds);
    expect(data.data.length).toBe(8);
    data.data.forEach(datum => {
      expect(datum).toEqual(1);
    }); 
  });
  it('returns the correct 2x2 image data out of a 3x3 image', () => {
    const image: ImageDataWrapper = {
        width: 3,
        height: 3,
        data: new Uint8ClampedArray([
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
          0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1
        ])
    };
    const bounds: DrawBounds = {
      minX: 1,
      maxX: 3,
      minY: 1,
      maxY: 3,
      width: 2,
      height: 2
    };
    const data = getPartialImageData(image, bounds);
    expect(data.data.length).toBe(16);
    data.data.forEach(datum => {
      expect(datum).toEqual(1);
    }); 
  });
});

describe('getBounds', () => {
    it('returns the correct bounds without maxing out ', () => {
        const p1 = {x: 2, y: 2};
        const p2 = {x: 3, y: 3};
        const bounds = getBounds(p1, p2, 2, 2, 6, 6);
        const bounds2 = getBounds(p2, p1, 2, 2, 6, 6);
        const expected = {
            minX: 1,
            maxX: 5,
            minY: 1,
            maxY: 5,
            width: 4,
            height: 4
        };
        expect(bounds).toEqual(expected);
        expect(bounds2).toEqual(expected);
    });
    it('returns the correct bounds when maxing out size', () => {
        const p1 = {x: 2, y: 2};
        const p2 = {x: 3, y: 3};
        const bounds = getBounds(p1, p2, 2, 2, 3, 3);
        const bounds2 = getBounds(p2, p1, 2, 2, 3, 3);
        const expected = {
            minX: 1,
            maxX: 3,
            minY: 1,
            maxY: 3,
            width: 2,
            height: 2
        };
        expect(bounds).toEqual(expected);
        expect(bounds2).toEqual(expected);
    });
    it('returns the correct bounds when mining out size', () => {
        const p1 = {x: 0, y: 0};
        const p2 = {x: 1, y: 1};
        const bounds = getBounds(p1, p2, 2, 2, 3, 3);
        const bounds2 = getBounds(p2, p1, 2, 2, 3, 3);
        const expected = {
            minX: 0,
            maxX: 3,
            minY: 0,
            maxY: 3,
            width: 3,
            height: 3
        };
        expect(bounds).toEqual(expected);
        expect(bounds2).toEqual(expected);
    });
    it('returns the correct bounds when points are the same', () => {
        const p1 = {x: 0, y: 0};
        const p2 = {x: 0, y: 0};
        const bounds = getBounds(p1, p2, 2, 2, 3, 3);
        const bounds2 = getBounds(p2, p1, 2, 2, 3, 3);
        const expected = {
            minX: 0,
            maxX: 2,
            minY: 0,
            maxY: 2,
            width: 2,
            height: 2
        };
        expect(bounds).toEqual(expected);
        expect(bounds2).toEqual(expected);
    });
    it('returns the correct bounds without size', () => {
        const p1 = {x: 0, y: 0};
        const p2 = {x: 0, y: 0};
        const bounds = getBounds(p1, p2, 0, 0, 3, 3);
        const bounds2 = getBounds(p2, p1, 0, 0, 3, 3);
        const expected = {
            minX: 0,
            maxX: 1,
            minY: 0,
            maxY: 1,
            width: 1,
            height: 1
        };
        expect(bounds).toEqual(expected);
        expect(bounds2).toEqual(expected);
    });
    it('returns the correct bounds when passing some x and y values below the range', () => {
      const p1 = { x: -5, y: -5 };
      const p2 = { x: 1, y: 1};
      const bounds = getBounds(p1, p2, 0, 0, 3, 3);
      const bounds2 = getBounds(p2, p1, 0, 0, 3, 3);
      const expected = {
        minX: 0,
        minY: 0,
        maxX: 2,
        maxY: 2,
        width: 2,
        height: 2
      };
      expect(bounds).toEqual(expected);
      expect(bounds2).toEqual(expected);
    });
    it('returns the correct bounds when passing some x and y values above the range', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 99, y: 99};
      const bounds = getBounds(p1, p2, 0, 0, 3, 3);
      const bounds2 = getBounds(p2, p1, 0, 0, 3, 3);
      const expected = {
        minX: 0,
        minY: 0,
        maxX: 3,
        maxY: 3,
        width: 3,
        height: 3
      };
      expect(bounds).toEqual(expected);
      expect(bounds2).toEqual(expected);
    });
    it('returns the correct bounds when passing all x and y values above the range', () => {
      const p1 = { x: 100, y: 100 };
      const p2 = { x: 99, y: 99};
      const bounds = getBounds(p1, p2, 0, 0, 3, 3);
      const bounds2 = getBounds(p2, p1, 0, 0, 3, 3);
      const expected = {
        minX: 3,
        minY: 3,
        maxX: 3,
        maxY: 3,
        width: 0,
        height: 0
      };
      expect(bounds).toEqual(expected);
      expect(bounds2).toEqual(expected);
    });
    it('returns the correct bounds when passing all x and y values below the range', () => {
      const p1 = { x: -5, y: -5 };
      const p2 = { x: -10, y: -10};
      const bounds = getBounds(p1, p2, 0, 0, 3, 3);
      const bounds2 = getBounds(p2, p1, 0, 0, 3, 3);
      const expected = {
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0,
        width: 0,
        height: 0
      };
      expect(bounds).toEqual(expected);
      expect(bounds2).toEqual(expected);
    });
    it('returns the correct bounds when passing all x and y values outside the range', () => {
      const p1 = { x: -5, y: -5 };
      const p2 = { x: 99, y: 99};
      const bounds = getBounds(p1, p2, 0, 0, 3, 3);
      const bounds2 = getBounds(p2, p1, 0, 0, 3, 3);
      const expected = {
        minX: 0,
        minY: 0,
        maxX: 3,
        maxY: 3,
        width: 3,
        height: 3
      };
      expect(bounds).toEqual(expected);
      expect(bounds2).toEqual(expected);
    });
});