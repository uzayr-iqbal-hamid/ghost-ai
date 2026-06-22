import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

interface AuthorizedOwner {
  userId: string;
  project: { id: string; ownerId: string };
}

interface AuthorizedViewer extends AuthorizedOwner {
  role: "owner" | "collaborator";
  email: string | null;
}

type AuthFailure = { error: Response };

function unauthorized(): AuthFailure {
  return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) };
}

function notFound(): AuthFailure {
  return { error: Response.json({ error: "Not found" }, { status: 404 }) };
}

function forbidden(): AuthFailure {
  return { error: Response.json({ error: "Forbidden" }, { status: 403 }) };
}

/**
 * Resolves the project and asserts the authenticated user owns it. Mirrors the
 * HTTP semantics used across the project routes: `401` unauthenticated, `404`
 * missing project, `403` non-owner.
 */
export async function authorizeProjectOwner(
  projectId: string,
): Promise<AuthFailure | AuthorizedOwner> {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  });
  if (!project) return notFound();
  if (project.ownerId !== userId) return forbidden();

  return { userId, project };
}

/**
 * Like {@link authorizeProjectOwner}, but also allows collaborators (matched by
 * their Clerk primary email). Used for read access to the collaborator list.
 */
export async function authorizeProjectViewer(
  projectId: string,
): Promise<AuthFailure | AuthorizedViewer> {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  });
  if (!project) return notFound();

  if (project.ownerId === userId) {
    return { userId, project, role: "owner", email: null };
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  if (email) {
    const membership = await prisma.projectCollaborator.findUnique({
      where: { projectId_email: { projectId, email } },
      select: { id: true },
    });
    if (membership) {
      return { userId, project, role: "collaborator", email };
    }
  }

  return forbidden();
}
