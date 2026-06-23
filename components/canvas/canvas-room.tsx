"use client";

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { ErrorBoundary } from "react-error-boundary";

import { CanvasFlow } from "@/components/canvas/canvas-flow";

interface CanvasRoomProps {
  /** Liveblocks room ID — equal to the project ID. */
  roomId: string;
}

/**
 * Client-side canvas wrapper. Connects to the Liveblocks room for the current
 * project (authenticating via `/api/liveblocks-auth`) and renders the
 * collaborative React Flow canvas once Storage is ready, with loading and
 * connection-error fallbacks.
 */
export function CanvasRoom({ roomId }: CanvasRoomProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, isThinking: false }}
      >
        <div className="h-full w-full bg-base">
          <ErrorBoundary FallbackComponent={CanvasError}>
            <ClientSideSuspense fallback={<CanvasLoading />}>
              <CanvasFlow />
            </ClientSideSuspense>
          </ErrorBoundary>
        </div>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

function CanvasLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-base">
      <p className="text-sm text-copy-muted">Loading canvas…</p>
    </div>
  );
}

function CanvasError() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-base px-6">
      <div className="max-w-sm text-center">
        <p className="text-sm font-medium text-copy-primary">
          Connection lost
        </p>
        <p className="mt-1 text-sm text-copy-muted">
          We couldn&apos;t connect to the collaborative canvas. Check your
          connection and try again.
        </p>
      </div>
    </div>
  );
}
