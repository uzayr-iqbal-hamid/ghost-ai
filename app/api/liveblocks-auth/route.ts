import type { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { getCursorColor } from "@/lib/cursor-color";
import { liveblocks } from "@/lib/liveblocks";
import { getProjectAccess, type ClerkIdentity } from "@/lib/project-access";

/**
 * Liveblocks authentication endpoint. The room ID is the project ID, so access
 * is granted only after verifying project membership against our own database
 * (Liveblocks rooms never hold their own permission state). Returns an access
 * token carrying the user's display name, avatar, and cursor color.
 */
export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { room?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const room = body?.room;
  if (typeof room !== "string" || room.length === 0) {
    return Response.json(
      { error: "room is required and must be a string" },
      { status: 400 },
    );
  }

  const identity: ClerkIdentity = {
    userId: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? null,
  };

  const access = await getProjectAccess(room, identity);
  if (access.status !== "owner" && access.status !== "collaborator") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Ensure the room exists before issuing a token, creating it only if needed.
  await liveblocks.getOrCreateRoom(room, {
    defaultAccesses: [],
    metadata: { projectName: access.project.name },
  });

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.fullName ?? user.firstName ?? identity.email ?? "Anonymous",
      avatar: user.imageUrl,
      color: getCursorColor(user.id),
    },
  });

  session.allow(room, session.FULL_ACCESS);

  const { status, body: token } = await session.authorize();
  return new Response(token, { status });
}
