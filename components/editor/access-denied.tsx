import Link from "next/link";
import { Lock } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-elevated p-4">
          <Lock className="h-8 w-8 text-copy-muted" />
        </div>
        <h1 className="text-xl font-medium text-copy-primary">
          Project unavailable
        </h1>
        <p className="text-sm text-copy-muted">
          You don&apos;t have access to this project, or it no longer exists.
        </p>
        <Link href="/editor" className={buttonVariants({ variant: "default" })}>
          Back to editor
        </Link>
      </div>
    </div>
  );
}
