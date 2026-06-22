"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, Copy, Loader2, Trash2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { CollaboratorView } from "@/lib/collaborators"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: { id: string; name: string } | null
  isOwner: boolean
}

export function ShareDialog({
  open,
  onOpenChange,
  project,
  isOwner,
}: ShareDialogProps) {
  const projectId = project?.id ?? null

  const [origin, setOrigin] = useState("")
  const [collaborators, setCollaborators] = useState<CollaboratorView[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)

  const [email, setEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)

  const [removingId, setRemovingId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  // Load the collaborator list each time the dialog opens for a project.
  useEffect(() => {
    if (!open || !projectId) return

    let cancelled = false
    setIsLoading(true)
    setListError(null)

    fetch(`/api/projects/${projectId}/collaborators`)
      .then(async (response) => {
        if (!response.ok) throw new Error("load failed")
        return (await response.json()) as { collaborators: CollaboratorView[] }
      })
      .then((data) => {
        if (!cancelled) setCollaborators(data.collaborators)
      })
      .catch(() => {
        if (!cancelled) setListError("Failed to load collaborators")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, projectId])

  // Reset transient input state when the dialog closes.
  useEffect(() => {
    if (open) return
    setEmail("")
    setInviteError(null)
    setCopied(false)
  }, [open])

  const link = origin && projectId ? `${origin}/editor/${projectId}` : ""

  const copyLink = useCallback(async () => {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (e.g. insecure context); leave feedback unchanged.
    }
  }, [link])

  const invite = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault()
      if (!projectId) return

      const trimmed = email.trim()
      if (trimmed.length === 0) return

      setIsInviting(true)
      setInviteError(null)
      try {
        const response = await fetch(
          `/api/projects/${projectId}/collaborators`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: trimmed }),
          },
        )

        if (!response.ok) {
          setInviteError(
            response.status === 409
              ? "This person is already a collaborator"
              : response.status === 400
                ? "Enter a valid email address"
                : "Failed to invite",
          )
          return
        }

        const data = (await response.json()) as {
          collaborator: CollaboratorView
        }
        setCollaborators((prev) => [...prev, data.collaborator])
        setEmail("")
      } catch {
        setInviteError("Failed to invite")
      } finally {
        setIsInviting(false)
      }
    },
    [projectId, email],
  )

  const remove = useCallback(
    async (collaboratorId: string) => {
      if (!projectId) return

      setRemovingId(collaboratorId)
      try {
        const response = await fetch(
          `/api/projects/${projectId}/collaborators/${collaboratorId}`,
          { method: "DELETE" },
        )
        if (response.ok) {
          setCollaborators((prev) =>
            prev.filter((collaborator) => collaborator.id !== collaboratorId),
          )
        }
      } catch {
        // Leave the row in place; the owner can retry.
      } finally {
        setRemovingId(null)
      }
    },
    [projectId],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>
            {isOwner
              ? "Invite people by email and manage who has access."
              : "People with access to this project."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-copy-secondary">
            Project link
          </label>
          <div className="flex items-center gap-2">
            <Input readOnly value={link} className="font-mono text-xs" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyLink}
              disabled={!link}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-success" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {isOwner && (
          <form className="flex flex-col gap-1.5" onSubmit={invite}>
            <label
              htmlFor="invite-email"
              className="text-xs font-medium text-copy-secondary"
            >
              Invite by email
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="invite-email"
                type="email"
                placeholder="teammate@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Button
                type="submit"
                size="sm"
                disabled={isInviting || email.trim().length === 0}
              >
                {isInviting ? "Inviting..." : "Invite"}
              </Button>
            </div>
            {inviteError && <p className="text-xs text-error">{inviteError}</p>}
          </form>
        )}

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-copy-secondary">
            Collaborators
          </p>

          {isLoading ? (
            <div className="flex items-center gap-2 py-2 text-xs text-copy-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : listError ? (
            <p className="py-2 text-xs text-error">{listError}</p>
          ) : collaborators.length === 0 ? (
            <p className="py-2 text-xs text-copy-muted">No collaborators yet.</p>
          ) : (
            <ScrollArea className="max-h-64">
              <ul className="flex flex-col gap-1 pr-3">
                {collaborators.map((collaborator) => (
                  <li
                    key={collaborator.id}
                    className="flex items-center gap-3 rounded-lg px-1 py-1.5"
                  >
                    <CollaboratorAvatar collaborator={collaborator} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-copy-primary">
                        {collaborator.name ?? collaborator.email}
                      </p>
                      {collaborator.name && (
                        <p className="truncate text-xs text-copy-muted">
                          {collaborator.email}
                        </p>
                      )}
                    </div>
                    {isOwner && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${collaborator.name ?? collaborator.email}`}
                        disabled={removingId === collaborator.id}
                        onClick={() => remove(collaborator.id)}
                      >
                        {removingId === collaborator.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-copy-muted" />
                        )}
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CollaboratorAvatar({
  collaborator,
}: {
  collaborator: CollaboratorView
}) {
  const initial =
    (collaborator.name ?? collaborator.email).trim().charAt(0).toUpperCase() ||
    "?"

  if (collaborator.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- Clerk avatar URLs are external; next/image config not warranted here.
      <img
        src={collaborator.imageUrl}
        alt=""
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-elevated text-xs font-medium text-copy-secondary">
      {initial}
    </div>
  )
}
