export interface TransformMatrix {
  tX: number;
  tY: number;
  skX: number;
  skY: number;
  scX: number;
  scY: number;
}

export class Transform {
  matrix: TransformMatrix;
  constructor(matrix?: TransformMatrix) {
    if (matrix) {
      this.matrix = matrix;      
    } else {
      return this.reset();
    }
  }

  multiply = (transform: Transform) => {
    const matrix: Partial<TransformMatrix> = {};
    matrix.scX = this.matrix.scX * transform.matrix.scX + this.matrix.skY * transform.matrix.skX;
    matrix.skX = this.matrix.skX * transform.matrix.scX + this.matrix.scY * transform.matrix.skX;
    matrix.skY = this.matrix.scX * transform.matrix.skY + this.matrix.skY * transform.matrix.scY;
    matrix.scY = this.matrix.skX * transform.matrix.skY + this.matrix.scY * transform.matrix.scY;
    matrix.tX = this.matrix.scX * transform.matrix.tX + this.matrix.skY * transform.matrix.tY + this.matrix.tX;
    matrix.tY = this.matrix.skX * transform.matrix.tX + this.matrix.scY * transform.matrix.tY + this.matrix.tY;
    return new Transform(matrix as TransformMatrix);
  }

  reset = () => {
    return new Transform({
      scX: 1,
      skX: 0,
      skY: 0,
      scY: 1,
      tX: 0,
      tY: 0
    });
  }

  invert = () => {
    const matrix: Partial<TransformMatrix> = {};
    const d = 1 / (this.matrix.scX * this.matrix.scY - this.matrix.skX * this.matrix.skY);
    matrix.scX = this.matrix.scY * d;
    matrix.skX = -this.matrix.skX * d;
    matrix.skY = -this.matrix.skY * d;
    matrix.scY = this.matrix.scX * d;
    matrix.tX = d * (this.matrix.skY * this.matrix.tY - this.matrix.scY * this.matrix.tX);
    matrix.tY = d * (this.matrix.skX * this.matrix.tX - this.matrix.scX * this.matrix.tY);
    return new Transform(matrix as TransformMatrix);
  }

  rotate = (rad: number) => {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const matrix: Partial<TransformMatrix> = {};
    matrix.scX = this.matrix.scX * c + this.matrix.skY * s;
    matrix.skX = this.matrix.skX * c + this.matrix.scY * s;
    matrix.skY = this.matrix.scX * -s + this.matrix.skY * c;
    matrix.scY = this.matrix.skX * -s + this.matrix.scY * c;
    matrix.tX = this.matrix.tX;
    matrix.tY = this.matrix.tY;
    return new Transform(matrix as TransformMatrix);
  }

  translate = (x: number, y: number) => {
    const matrix: Partial<TransformMatrix> = {};    
    matrix.scX = this.matrix.scX;
    matrix.skX = this.matrix.skX;
    matrix.skY = this.matrix.skY;
    matrix.scY = this.matrix.scY;
    matrix.tX = this.matrix.tX + this.matrix.scX * x + this.matrix.skY * y;
    matrix.tY = this.matrix.tY + this.matrix.skX * x + this.matrix.scY * y;
    return new Transform(matrix as TransformMatrix);
  }

  scale = (x: number, y: number) => {
    const matrix: Partial<TransformMatrix> = {};
    matrix.scX = this.matrix.scX * x;
    matrix.skX = this.matrix.skX * x;
    matrix.skY = this.matrix.skY * y;
    matrix.scY = this.matrix.scY * y;
    matrix.tX = this.matrix.tX;
    matrix.tY = this.matrix.tY;
    return new Transform(matrix as TransformMatrix);
  }

  toArray = () => {
    return [
      this.matrix.scX,
      this.matrix.skX,
      this.matrix.skY,
      this.matrix.scY,
      this.matrix.tX,
      this.matrix.tY
    ];
  }

  transformPoint = (point: {x: number, y: number}) => {
    const newX = point.x * this.matrix.scX + point.y * this.matrix.skY + this.matrix.tX;
    const newY = point.x * this.matrix.skX + point.y * this.matrix.scY + this.matrix.tY;
    return { x: newX, y: newY };
  }
}