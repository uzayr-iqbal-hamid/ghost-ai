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
import { Input } from "@/components/ui/input"
import { useProjectDialogsContext } from "./project-dialogs-context"

export function CreateProjectDialog() {
  const { mode, name, isLoading, error, roomIdPreview, setName, close, submit } =
    useProjectDialogsContext()

  const open = mode === "create"
  const canSubmit = name.trim().length > 0 && !isLoading

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) close()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Give your new architecture workspace a name.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            if (canSubmit) submit()
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-project-name"
              className="text-xs font-medium text-copy-secondary"
            >
              Project name
            </label>
            <Input
              id="create-project-name"
              autoFocus
              placeholder="My new system"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-copy-secondary">
              Room ID
            </span>
            <code className="rounded-lg border border-surface-border bg-elevated px-2.5 py-1.5 font-mono text-xs text-copy-muted">
              {roomIdPreview || "your-room-id"}
            </code>
          </div>

          {error && (
            <p className="text-xs text-error">{error}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {isLoading ? "Creating..." : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
