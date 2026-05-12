"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useProjectDialogsContext } from "./project-dialogs-context"

export function DeleteProjectDialog() {
  const { mode, activeProject, isLoading, error, close, submit } =
    useProjectDialogsContext()

  const open = mode === "delete" && activeProject !== null

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) close()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            Delete{" "}
            <span className="text-copy-primary">{activeProject?.name}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-xs text-error">{error}</p>}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoading}
            onClick={() => submit()}
          >
            {isLoading ? "Deleting..." : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
