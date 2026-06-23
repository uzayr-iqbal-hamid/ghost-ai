"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";

import type { CanvasNode } from "@/types/canvas";

/**
 * Basic renderer for the custom `canvasNode` type. For this unit every shape is
 * drawn as a simple bordered rectangle with its label centered; shape-specific
 * visuals (diamond, hexagon, cylinder, …) are added in a later feature. The node
 * fill comes from the node's `data.color`; its size is set on the node `style`.
 */
function CanvasNodeRendererComponent({ data }: NodeProps<CanvasNode>) {
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-xl border border-surface-border px-3 text-center text-sm text-copy-primary"
      style={{ backgroundColor: data.color }}
    >
      {data.label}
    </div>
  );
}

export const CanvasNodeRenderer = memo(CanvasNodeRendererComponent);
