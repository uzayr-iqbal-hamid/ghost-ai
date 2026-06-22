import { clerkClient } from "@clerk/nextjs/server";

export interface CollaboratorRow {
  id: string;
  email: string;
}

export interface CollaboratorView {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
}

const CLERK_USER_LIST_MAX = 500;

/**
 * Enriches stored collaborator emails with Clerk display name and avatar.
 * Collaborators are persisted by email only (no local user table), so this is
 * a best-effort lookup: emails without a matching Clerk user — or any Clerk
 * failure — fall back to email-only views.
 */
export async function enrichCollaborators(
  rows: CollaboratorRow[],
): Promise<CollaboratorView[]> {
  if (rows.length === 0) {
    return [];
  }

  const emails = rows.map((row) => row.email);
  const usersByEmail = new Map<
    string,
    { name: string | null; imageUrl: string | null }
  >();

  try {
    const client = await clerkClient();
    const { data } = await client.users.getUserList({
      emailAddress: emails,
      limit: Math.min(emails.length, CLERK_USER_LIST_MAX),
    });

    for (const user of data) {
      const name = user.fullName ?? user.firstName ?? null;
      for (const address of user.emailAddresses) {
        usersByEmail.set(address.emailAddress.toLowerCase(), {
          name,
          imageUrl: user.imageUrl,
        });
      }
    }
  } catch {
    // Clerk lookup failed — fall back to email-only enrichment below.
  }

  return rows.map((row) => {
    const match = usersByEmail.get(row.email.toLowerCase());
    return {
      id: row.id,
      email: row.email,
      name: match?.name ?? null,
      imageUrl: match?.imageUrl ?? null,
    };
  });
}
