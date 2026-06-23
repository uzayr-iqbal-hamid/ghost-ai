import { Liveblocks } from "@liveblocks/node";

const secret = process.env.LIVEBLOCKS_SECRET_KEY;

if (!secret) {
  throw new Error("LIVEBLOCKS_SECRET_KEY is not set");
}

const createLiveblocksClient = (): Liveblocks => new Liveblocks({ secret });

const globalForLiveblocks = globalThis as unknown as {
  liveblocks: Liveblocks | undefined;
};

export const liveblocks: Liveblocks =
  globalForLiveblocks.liveblocks ?? createLiveblocksClient();

if (process.env.NODE_ENV !== "production") {
  globalForLiveblocks.liveblocks = liveblocks;
}
