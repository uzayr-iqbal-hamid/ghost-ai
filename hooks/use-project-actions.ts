"use client"

import { useCallback, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { slugify } from "@/lib/slugify"
import type { ProjectSummary } from "@/lib/projects"

export type ProjectActionsMode = "create" | "rename" | "delete" | null

export interface UseProjectActionsResult {
  mode: ProjectActionsMode
  activeProject: ProjectSummary | null
  name: string
  isLoading: boolean
  error: string | null
  roomIdPreview: string
  setName: (value: string) => void
  openCreate: () => void
  openRename: (project: ProjectSummary) => void
  openDelete: (project: ProjectSummary) => void
  close: () => void
  submit: () => Promise<void>
}

const DEFAULT_PROJECT_NAME = "Untitled Project"
const ROOM_ID_FALLBACK_SLUG = "untitled-project"

function generateSuffix(): string {
  const bytes = new Uint8Array(3)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
}

function buildRoomId(name: string, suffix: string): string {
  const slug = slugify(name) || ROOM_ID_FALLBACK_SLUG
  return `${slug}-${suffix}`
}

export function useProjectActions(): UseProjectActionsResult {
  const router = useRouter()
  const pathname = usePathname()

  const [mode, setMode] = useState<ProjectActionsMode>(null)
  const [activeProject, setActiveProject] = useState<ProjectSummary | null>(
    null,
  )
  const [name, setName] = useState("")
  const [suffix, setSuffix] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const close = useCallback(() => {
    setMode(null)
    setActiveProject(null)
    setName("")
    setSuffix("")
    setIsLoading(false)
    setError(null)
  }, [])

  const openCreate = useCallback(() => {
    setActiveProject(null)
    setName("")
    setSuffix(generateSuffix())
    setError(null)
    setMode("create")
  }, [])

  const openRename = useCallback((project: ProjectSummary) => {
    setActiveProject(project)
    setName(project.name)
    setSuffix("")
    setError(null)
    setMode("rename")
  }, [])

  const openDelete = useCallback((project: ProjectSummary) => {
    setActiveProject(project)
    setName("")
    setSuffix("")
    setError(null)
    setMode("delete")
  }, [])

  const roomIdPreview = useMemo(
    () => (suffix ? buildRoomId(name, suffix) : ""),
    [name, suffix],
  )

  const submit = useCallback(async () => {
    if (mode === "create") {
      const trimmed = name.trim()
      const resolvedName = trimmed.length > 0 ? trimmed : DEFAULT_PROJECT_NAME
      const id = buildRoomId(resolvedName, suffix)

      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, name: resolvedName }),
        })

        if (!response.ok) {
          setIsLoading(false)
          setError("Failed to create project")
          return
        }

        const data = (await response.json()) as { project: { id: string } }
        close()
        router.push(`/editor/${data.project.id}`)
      } catch {
        setIsLoading(false)
        setError("Failed to create project")
      }
      return
    }

    if (mode === "rename" && activeProject) {
      const trimmed = name.trim()
      if (trimmed.length === 0 || trimmed === activeProject.name) {
        return
      }

      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/projects/${activeProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmed }),
        })

        if (!response.ok) {
          setIsLoading(false)
          setError("Failed to rename project")
          return
        }

        close()
        router.refresh()
      } catch {
        setIsLoading(false)
        setError("Failed to rename project")
      }
      return
    }

    if (mode === "delete" && activeProject) {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/projects/${activeProject.id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          setIsLoading(false)
          setError("Failed to delete project")
          return
        }

        const onDeletedWorkspace =
          pathname === `/editor/${activeProject.id}` ||
          pathname?.startsWith(`/editor/${activeProject.id}/`) === true

        close()
        if (onDeletedWorkspace) {
          router.push("/editor")
        } else {
          router.refresh()
        }
      } catch {
        setIsLoading(false)
        setError("Failed to delete project")
      }
      return
    }
  }, [mode, name, suffix, activeProject, pathname, router, close])

  return {
    mode,
    activeProject,
    name,
    isLoading,
    error,
    roomIdPreview,
    setName,
    openCreate,
    openRename,
    openDelete,
    close,
    submit,
  }
}
