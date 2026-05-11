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

export function RenameProjectDialog() {
  const { mode, activeProject, name, isLoading, setName, close, submit } =
    useProjectDialogsContext()

  const open = mode === "rename" && activeProject !== null
  const trimmed = name.trim()
  const canSubmit =
    trimmed.length > 0 && trimmed !== activeProject?.name && !isLoading

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) close()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>
            Renaming{" "}
            <span className="text-copy-primary">{activeProject?.name}</span>.
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
              htmlFor="rename-project-name"
              className="text-xs font-medium text-copy-secondary"
            >
              Project name
            </label>
            <Input
              id="rename-project-name"
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
