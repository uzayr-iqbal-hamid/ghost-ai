// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
//
// Only the members this feature uses are declared. Storage, RoomEvent, and the
// other members fall back to library defaults until later features add them
// (e.g. canvas Storage for nodes/edges).
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Live cursor position on the canvas, or null when the cursor leaves it.
      cursor: { x: number; y: number } | null;
      // Whether the user is waiting on an AI generation.
      isThinking: boolean;
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      // The Clerk user ID.
      id: string;
      info: {
        // Display name shown on cursors and avatar stacks.
        name: string;
        // Avatar image URL.
        avatar: string;
        // Deterministic cursor color derived from the user ID.
        color: string;
      };
    };
  }
}

export {};
