import { getBounds, getBoundsIndices } from './canvas';

describe('getPartialImageData', () => {
    it('returns the correct 1x1 image data out of a 3x3 image', () => {
        const image = {
            width: 3,
            height: 3,
            data: new Uint8ClampedArray(9)
        };
        const startIndex = 1;
    });
});

describe('getBoundsIndices', () => {
    it('returns the correct indices for a 2x2 subsection of a 2x2 image', () => {
        const image = new ImageData(2, 2);
        const bounds = {
            minX: 0,
            maxX: 1,
            minY: 0,
            maxY: 1,
            width: 2,
            height: 2
        };
        const indices = getBoundsIndices(image, bounds, 4);
        expect(indices.startIndex).toBe(0);   
        expect(indices.endIndex).toBe(16);     
        expect(indices.endIndex - indices.startIndex).toBe(bounds.width * bounds.height * 4);
    });
    it('returns the correct indices for a 1x1 subsection of a 3x3 image', () => {
        const image = new ImageData(3, 3);
        const bounds = {
            minX: 1,
            maxX: 1,
            minY: 1,
            maxY: 1,
            width: 1,
            height: 1
        };
        const indices = getBoundsIndices(image, bounds, 4);
        expect(indices.startIndex).toBe(16);   
        expect(indices.endIndex).toBe(20);     
        expect(indices.endIndex - indices.startIndex).toBe(bounds.width * bounds.height * 4);
    });
    it('returns the correct indices for a 1x1 subsection of a 3x3 image', () => {
        const image = {
            width: 3,
            height: 3,
            data: new Uint8ClampedArray(9)
        };
        const bounds = {
            minX: 1,
            maxX: 2,
            minY: 1,
            maxY: 2,
            width: 2,
            height: 2
        };
        const indices = getBoundsIndices(image, bounds, 4);
        expect(indices).toEqual({
            startIndex: 16,
            endIndex: 36
        });
        expect(indices.endIndex - indices.startIndex).toBe(20);
    });
});
describe('getBounds', () => {
    it('returns the correct bounds without maxing out ', () => {
        const p1 = {x: 2, y: 2};
        const p2 = {x: 3, y: 3};
        const bounds = getBounds(p1, p2, 1, 1, 6, 6);
        const bounds2 = getBounds(p2, p1, 1, 1, 6, 6);
        const expected = {
            minX: 1,
            maxX: 4,
            minY: 1,
            maxY: 4,
            width: 3,
            height: 3
        };
        expect(bounds).toEqual(expected);
        expect(bounds2).toEqual(expected);
    });
    it('returns the correct bounds when maxing out size', () => {
        const p1 = {x: 2, y: 2};
        const p2 = {x: 3, y: 3};
        const bounds = getBounds(p1, p2, 1, 1, 3, 3);
        const bounds2 = getBounds(p2, p1, 1, 1, 3, 3);
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
        const bounds = getBounds(p1, p2, 1, 1, 3, 3);
        const bounds2 = getBounds(p2, p1, 1, 1, 3, 3);
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
    it('returns the correct bounds when points are the same', () => {
        const p1 = {x: 0, y: 0};
        const p2 = {x: 0, y: 0};
        const bounds = getBounds(p1, p2, 1, 1, 3, 3);
        const bounds2 = getBounds(p2, p1, 1, 1, 3, 3);
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
    it('returns the correct bounds without size', () => {
        const p1 = {x: 0, y: 0};
        const p2 = {x: 0, y: 0};
        const bounds = getBounds(p1, p2, 0, 0, 3, 3);
        const bounds2 = getBounds(p2, p1, 0, 0, 3, 3);
        const expected = {
            minX: 0,
            maxX: 0,
            minY: 0,
            maxY: 0,
            width: 0,
            height: 0
        };
        expect(bounds).toEqual(expected);
        expect(bounds2).toEqual(expected);
    });
});