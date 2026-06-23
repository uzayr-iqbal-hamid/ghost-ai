import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { authorizeProjectOwner } from "@/lib/project-authorization";

type Context = {
  params: Promise<{ projectId: string; collaboratorId: string }>;
};

export async function DELETE(_request: NextRequest, ctx: Context) {
  const { projectId, collaboratorId } = await ctx.params;

  const authResult = await authorizeProjectOwner(projectId);
  if ("error" in authResult) return authResult.error;

  const { count } = await prisma.projectCollaborator.deleteMany({
    where: { id: collaboratorId, projectId },
  });

  if (count === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
