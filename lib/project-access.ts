import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export interface ClerkIdentity {
  userId: string;
  email: string | null;
}

export interface WorkspaceProject {
  id: string;
  ownerId: string;
  name: string;
}

export type ProjectAccessResult =
  | { status: "owner"; project: WorkspaceProject }
  | { status: "collaborator"; project: WorkspaceProject }
  | { status: "denied" }
  | { status: "not-found" };

export async function getCurrentIdentity(): Promise<ClerkIdentity | null> {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  return { userId, email };
}

export async function getProjectAccess(
  projectId: string,
  identity: ClerkIdentity,
): Promise<ProjectAccessResult> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      ownerId: true,
      name: true,
      collaborators: identity.email
        ? {
            where: { email: identity.email },
            select: { id: true },
            take: 1,
          }
        : false,
    },
  });

  if (!project) {
    return { status: "not-found" };
  }

  const workspaceProject: WorkspaceProject = {
    id: project.id,
    ownerId: project.ownerId,
    name: project.name,
  };

  if (project.ownerId === identity.userId) {
    return { status: "owner", project: workspaceProject };
  }

  if (
    identity.email &&
    "collaborators" in project &&
    Array.isArray(project.collaborators) &&
    project.collaborators.length > 0
  ) {
    return { status: "collaborator", project: workspaceProject };
  }

  return { status: "denied" };
}
