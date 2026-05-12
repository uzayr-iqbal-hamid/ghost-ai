import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ projectId: string }> };

async function authorizeOwner(projectId: string) {
  const { userId } = await auth();
  if (!userId) {
    return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  });

  if (!project) {
    return { error: Response.json({ error: "Not found" }, { status: 404 }) };
  }

  if (project.ownerId !== userId) {
    return { error: Response.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { userId, project };
}

export async function PATCH(request: NextRequest, ctx: Context) {
  const { projectId } = await ctx.params;

  const authResult = await authorizeOwner(projectId);
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

  const authResult = await authorizeOwner(projectId);
  if ("error" in authResult) return authResult.error;

  await prisma.project.delete({ where: { id: projectId } });

  return new Response(null, { status: 204 });
}
