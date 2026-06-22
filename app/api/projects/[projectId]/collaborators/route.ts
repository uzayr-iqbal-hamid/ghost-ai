import type { NextRequest } from "next/server";

import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { enrichCollaborators } from "@/lib/collaborators";
import {
  authorizeProjectOwner,
  authorizeProjectViewer,
} from "@/lib/project-authorization";

type Context = { params: Promise<{ projectId: string }> };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(_request: NextRequest, ctx: Context) {
  const { projectId } = await ctx.params;

  const authResult = await authorizeProjectViewer(projectId);
  if ("error" in authResult) return authResult.error;

  const rows = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true },
  });

  const collaborators = await enrichCollaborators(rows);

  return Response.json({ collaborators });
}

export async function POST(request: NextRequest, ctx: Context) {
  const { projectId } = await ctx.params;

  const authResult = await authorizeProjectOwner(projectId);
  if ("error" in authResult) return authResult.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = (body ?? {}) as { email?: unknown };
  if (typeof input.email !== "string") {
    return Response.json(
      { error: "email is required and must be a string" },
      { status: 400 },
    );
  }

  const email = input.email.trim().toLowerCase();
  if (email.length === 0 || !EMAIL_PATTERN.test(email)) {
    return Response.json(
      { error: "email must be a valid email address" },
      { status: 400 },
    );
  }

  try {
    const created = await prisma.projectCollaborator.create({
      data: { projectId, email },
      select: { id: true, email: true },
    });

    const [collaborator] = await enrichCollaborators([created]);

    return Response.json({ collaborator }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        { error: "This person is already a collaborator" },
        { status: 409 },
      );
    }
    throw error;
  }
}
