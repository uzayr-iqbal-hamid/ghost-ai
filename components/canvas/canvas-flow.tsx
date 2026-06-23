"use client";

import { useRef } from "react";
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type NodeTypes,
} from "@xyflow/react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";

import "@xyflow/react/dist/style.css";

import { CanvasNodeRenderer } from "@/components/canvas/canvas-node";
import { ShapePanel } from "@/components/canvas/shape-panel";
import {
  CANVAS_NODE_TYPE,
  DEFAULT_NODE_COLOR,
  type CanvasEdge,
  type CanvasNode,
} from "@/types/canvas";
import { parseShapeDragPayload, SHAPE_DRAG_MIME } from "@/lib/shape-drag";

/** Stable map of custom node types — defined once outside render. */
const nodeTypes: NodeTypes = {
  [CANVAS_NODE_TYPE]: CanvasNodeRenderer,
};

/**
 * React Flow canvas backed by Liveblocks Storage. `useLiveblocksFlow` owns the
 * synced nodes/edges and the change handlers. Shapes dragged from the bottom
 * `ShapePanel` are dropped onto the canvas to create new nodes. Wrapped in a
 * `ReactFlowProvider` so `useReactFlow().screenToFlowPosition` is available for
 * converting drop coordinates into canvas space.
 */
export function CanvasFlow() {
  return (
    <ReactFlowProvider>
      <CanvasFlowInner />
    </ReactFlowProvider>
  );
}

function CanvasFlowInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  const { screenToFlowPosition } = useReactFlow<CanvasNode, CanvasEdge>();
  // Monotonic counter to keep node IDs unique within rapid same-tick drops.
  const nodeCounter = useRef(0);

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const payload = parseShapeDragPayload(
      event.dataTransfer.getData(SHAPE_DRAG_MIME),
    );
    if (!payload) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const id = `${payload.shape}-${Date.now()}-${nodeCounter.current++}`;
    const newNode: CanvasNode = {
      id,
      type: CANVAS_NODE_TYPE,
      position,
      data: { label: "", color: DEFAULT_NODE_COLOR, shape: payload.shape },
      style: { width: payload.width, height: payload.height },
    };

    onNodesChange([{ type: "add", item: newNode }]);
  }

  return (
    <div
      className="relative h-full w-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap />
      </ReactFlow>
      <ShapePanel />
    </div>
  );
}
