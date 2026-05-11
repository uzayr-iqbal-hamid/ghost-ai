"use client"

import { useMemo } from "react"
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
import { slugify } from "@/lib/slugify"
import { useProjectDialogsContext } from "./project-dialogs-context"

export function CreateProjectDialog() {
  const { mode, name, isLoading, setName, close, submit } =
    useProjectDialogsContext()

  const open = mode === "create"
  const slug = useMemo(() => slugify(name), [name])
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
              Slug preview
            </span>
            <code className="rounded-lg border border-surface-border bg-elevated px-2.5 py-1.5 font-mono text-xs text-copy-muted">
              {slug || "your-project-slug"}
            </code>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              Create project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
