"use client"

import { useCallback, useState } from "react"
import type { MockProject } from "@/lib/mock-projects"

export type ProjectDialogMode = "create" | "rename" | "delete" | null

export interface UseProjectDialogsResult {
  mode: ProjectDialogMode
  activeProject: MockProject | null
  name: string
  isLoading: boolean
  setName: (value: string) => void
  openCreate: () => void
  openRename: (project: MockProject) => void
  openDelete: (project: MockProject) => void
  close: () => void
  submit: () => Promise<void>
}

export function useProjectDialogs(): UseProjectDialogsResult {
  const [mode, setMode] = useState<ProjectDialogMode>(null)
  const [activeProject, setActiveProject] = useState<MockProject | null>(null)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const close = useCallback(() => {
    setMode(null)
    setActiveProject(null)
    setName("")
    setIsLoading(false)
  }, [])

  const openCreate = useCallback(() => {
    setActiveProject(null)
    setName("")
    setMode("create")
  }, [])

  const openRename = useCallback((project: MockProject) => {
    setActiveProject(project)
    setName(project.name)
    setMode("rename")
  }, [])

  const openDelete = useCallback((project: MockProject) => {
    setActiveProject(project)
    setName("")
    setMode("delete")
  }, [])

  const submit = useCallback(async () => {
    setIsLoading(true)
    await Promise.resolve()
    setIsLoading(false)
    setMode(null)
    setActiveProject(null)
    setName("")
  }, [])

  return {
    mode,
    activeProject,
    name,
    isLoading,
    setName,
    openCreate,
    openRename,
    openDelete,
    close,
    submit,
  }
}
