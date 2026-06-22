import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { authorizeProjectOwner } from "@/lib/project-authorization";

type Context = { params: Promise<{ projectId: string }> };

export async function PATCH(request: NextRequest, ctx: Context) {
  const { projectId } = await ctx.params;

  const authResult = await authorizeProjectOwner(projectId);
  if ("error" in authResult) return authResult.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = (body ?? {}) as { name?: unknown };

  if (typeof input.name !== "string") {
    return Response.json(
      { error: "name is required and must be a string" },
      { status: 400 },
    );
  }

  const name = input.name.trim();
  if (name.length === 0) {
    return Response.json(
      { error: "name must not be empty" },
      { status: 400 },
    );
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { name },
  });

  return Response.json({ project });
}

export async function DELETE(_request: NextRequest, ctx: Context) {
  const { projectId } = await ctx.params;

  const authResult = await authorizeProjectOwner(projectId);
  if ("error" in authResult) return authResult.error;

  await prisma.project.delete({ where: { id: projectId } });

  return new Response(null, { status: 204 });
}
