"use client";

import {
  Circle,
  Cylinder,
  Diamond,
  Hexagon,
  Pill,
  RectangleHorizontal,
  type LucideIcon,
} from "lucide-react";

import {
  NODE_SHAPE_DEFAULT_SIZES,
  type CanvasNodeShape,
} from "@/types/canvas";
import {
  SHAPE_DRAG_MIME,
  serializeShapeDragPayload,
} from "@/lib/shape-drag";

interface ShapePanelItem {
  shape: CanvasNodeShape;
  label: string;
  Icon: LucideIcon;
}

const SHAPE_PANEL_ITEMS: ShapePanelItem[] = [
  { shape: "rectangle", label: "Rectangle", Icon: RectangleHorizontal },
  { shape: "diamond", label: "Diamond", Icon: Diamond },
  { shape: "circle", label: "Circle", Icon: Circle },
  { shape: "pill", label: "Pill", Icon: Pill },
  { shape: "cylinder", label: "Cylinder", Icon: Cylinder },
  { shape: "hexagon", label: "Hexagon", Icon: Hexagon },
];

function handleDragStart(
  event: React.DragEvent<HTMLButtonElement>,
  shape: CanvasNodeShape,
) {
  const { width, height } = NODE_SHAPE_DEFAULT_SIZES[shape];
  event.dataTransfer.setData(
    SHAPE_DRAG_MIME,
    serializeShapeDragPayload({ shape, width, height }),
  );
  event.dataTransfer.effectAllowed = "move";
}

/**
 * Floating pill-shaped toolbar pinned to the bottom-center of the canvas. Each
 * button is draggable and writes the shape name + default size into the drag's
 * `DataTransfer`; the canvas reads that payload on drop to create a new node.
 */
export function ShapePanel() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-surface-border bg-surface/90 px-2 py-1.5 shadow-lg backdrop-blur">
        {SHAPE_PANEL_ITEMS.map(({ shape, label, Icon }) => (
          <button
            key={shape}
            type="button"
            draggable
            onDragStart={(event) => handleDragStart(event, shape)}
            title={`Drag to add ${label.toLowerCase()}`}
            aria-label={`Add ${label.toLowerCase()}`}
            className="flex h-9 w-9 cursor-grab items-center justify-center rounded-full text-copy-secondary transition-colors hover:bg-elevated hover:text-copy-primary active:cursor-grabbing"
          >
            <Icon className="h-5 w-5" />
          </button>
        ))}
      </div>
    </div>
  );
}
