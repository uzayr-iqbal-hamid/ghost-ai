import { NODE_SHAPES, type CanvasNodeShape } from "@/types/canvas";

/**
 * Custom `DataTransfer` MIME type used to carry a shape from the shape panel to
 * the canvas during a drag. Namespaced so it never collides with text/url drags.
 */
export const SHAPE_DRAG_MIME = "application/x-ghost-shape";

/** Payload carried in the drag's `DataTransfer` while dragging a shape. */
export interface ShapeDragPayload {
  /** The shape being dragged. */
  shape: CanvasNodeShape;
  /** Default node width (px) to apply on drop. */
  width: number;
  /** Default node height (px) to apply on drop. */
  height: number;
}

/** Serialize a shape drag payload for `dataTransfer.setData`. */
export function serializeShapeDragPayload(payload: ShapeDragPayload): string {
  return JSON.stringify(payload);
}

/**
 * Parse and validate a shape drag payload read from `dataTransfer.getData`.
 * Drop data is untrusted external input, so every field is checked before it is
 * used to create a node. Returns `null` when the payload is missing or invalid.
 */
export function parseShapeDragPayload(raw: string): ShapeDragPayload | null {
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) return null;

  const { shape, width, height } = parsed as Record<string, unknown>;

  if (
    typeof shape !== "string" ||
    !(NODE_SHAPES as readonly string[]).includes(shape) ||
    typeof width !== "number" ||
    !Number.isFinite(width) ||
    typeof height !== "number" ||
    !Number.isFinite(height)
  ) {
    return null;
  }

  return { shape: shape as CanvasNodeShape, width, height };
}
