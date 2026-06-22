import { redirect } from "next/navigation";

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

  return (
    <div className="flex h-full items-center justify-center bg-base px-6">
      <p className="text-sm text-copy-muted">
        Canvas for {access.project.name} will render here.
      </p>
    </div>
  );
}
