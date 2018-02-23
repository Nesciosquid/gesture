import Tool from './Tool';

export enum ToolType {
  CURVES,
  IMAGE,
  PATTERN,
  LINES,
  GRADIENTS,
}

export type ToolOptions = ({[id: string]: Tool});