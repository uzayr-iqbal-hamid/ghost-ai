import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export interface ProjectSummary {
  id: string;
  name: string;
  ownerId: string;
}

export interface ProjectLists {
  owned: ProjectSummary[];
  shared: ProjectSummary[];
}

export async function getProjectsForUser(): Promise<ProjectLists> {
  const { userId } = await auth();
  if (!userId) {
    return { owned: [], shared: [] };
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  const ownedRows = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, ownerId: true },
  });

  const sharedRows = email
    ? await prisma.project.findMany({
        where: {
          ownerId: { not: userId },
          collaborators: { some: { email } },
        },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, ownerId: true },
      })
    : [];

  return { owned: ownedRows, shared: sharedRows };
}
