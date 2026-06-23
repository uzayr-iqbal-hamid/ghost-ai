import type { Edge, Node } from "@xyflow/react";

/**
 * Supported node shapes on the canvas. Mirrors the shape set documented in
 * `context/ui-context.md`. Complex shapes (diamond, hexagon, cylinder) are
 * rendered as inline SVGs once custom node rendering is added.
 */
export const NODE_SHAPES = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
] as const;

export type CanvasNodeShape = (typeof NODE_SHAPES)[number];

/**
 * Data carried by every canvas node. Kept assignable to React Flow's node data
 * constraint (`Record<string, unknown>`).
 */
export interface CanvasNodeData extends Record<string, unknown> {
  /** Text label shown inside the node. */
  label: string;
  /** Node fill color (hex), one of the documented `NODE_COLORS` fills. */
  color: string;
  /** Visual shape of the node. */
  shape: CanvasNodeShape;
}

/** The single custom React Flow node type used on the canvas. */
export const CANVAS_NODE_TYPE = "canvasNode";

/** The single custom React Flow edge type used on the canvas. */
export const CANVAS_EDGE_TYPE = "canvasEdge";

/** A canvas node — a React Flow node of type `canvasNode`. */
export type CanvasNode = Node<CanvasNodeData, typeof CANVAS_NODE_TYPE>;

/** A canvas edge — a React Flow edge of type `canvasEdge`. */
export type CanvasEdge = Edge<Record<string, unknown>, typeof CANVAS_EDGE_TYPE>;

/**
 * Default node fill color used for newly created nodes — the neutral dark
 * "default" pair documented in `context/ui-context.md` (`NODE_COLORS`).
 */
export const DEFAULT_NODE_COLOR = "#1F1F1F";

/** Pixel dimensions of a node. */
export interface NodeSize {
  width: number;
  height: number;
}

/**
 * Default size (px) used when a shape is dropped onto the canvas. Rectangles
 * and pills are wider than tall, circles are square, and diamonds are slightly
 * larger so their centered labels have room.
 */
export const NODE_SHAPE_DEFAULT_SIZES: Record<CanvasNodeShape, NodeSize> = {
  rectangle: { width: 180, height: 80 },
  diamond: { width: 180, height: 130 },
  circle: { width: 120, height: 120 },
  pill: { width: 180, height: 64 },
  cylinder: { width: 140, height: 120 },
  hexagon: { width: 170, height: 100 },
};
