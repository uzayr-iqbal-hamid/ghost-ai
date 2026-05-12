import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const DEFAULT_PROJECT_NAME = "Untitled Project";
const PROJECT_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ projects });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown = {};
  try {
    if (request.headers.get("content-length") !== "0") {
      body = await request.json();
    }
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = (body ?? {}) as {
    id?: unknown;
    name?: unknown;
    description?: unknown;
  };

  const rawName = typeof input.name === "string" ? input.name.trim() : "";
  const name = rawName.length > 0 ? rawName : DEFAULT_PROJECT_NAME;

  let description: string | undefined;
  if (typeof input.description === "string") {
    const trimmed = input.description.trim();
    description = trimmed.length > 0 ? trimmed : undefined;
  } else if (input.description !== undefined && input.description !== null) {
    return Response.json(
      { error: "description must be a string" },
      { status: 400 },
    );
  }

  let id: string | undefined;
  if (typeof input.id === "string") {
    const trimmed = input.id.trim();
    if (trimmed.length === 0 || !PROJECT_ID_PATTERN.test(trimmed)) {
      return Response.json(
        { error: "id must match /^[a-z0-9][a-z0-9-]{0,63}$/" },
        { status: 400 },
      );
    }
    id = trimmed;
  } else if (input.id !== undefined && input.id !== null) {
    return Response.json({ error: "id must be a string" }, { status: 400 });
  }

  try {
    const project = await prisma.project.create({
      data: {
        ...(id ? { id } : {}),
        ownerId: userId,
        name,
        description,
      },
    });

    return Response.json({ project }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        { error: "Project id already exists" },
        { status: 409 },
      );
    }
    throw error;
  }
}
