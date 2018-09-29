import Tool from './Tool';

export enum ToolType {
  CURVES,
  IMAGE,
  PATTERN,
  LINES,
  GRADIENTS,
  TARGET
}

export type ToolOptions = ({[id: string]: Tool});