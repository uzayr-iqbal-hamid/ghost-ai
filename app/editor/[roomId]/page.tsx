import { redirect } from "next/navigation";

import { CanvasRoom } from "@/components/canvas/canvas-room";
import { AccessDenied } from "@/components/editor/access-denied";
import { getCurrentIdentity, getProjectAccess } from "@/lib/project-access";

interface EditorRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default async function EditorRoomPage({ params }: EditorRoomPageProps) {
  const identity = await getCurrentIdentity();
  if (!identity) {
    redirect("/sign-in");
  }

  const { roomId } = await params;
  const access = await getProjectAccess(roomId, identity);

  if (access.status === "not-found" || access.status === "denied") {
    return <AccessDenied />;
  }

  return <CanvasRoom roomId={roomId} />;
}
