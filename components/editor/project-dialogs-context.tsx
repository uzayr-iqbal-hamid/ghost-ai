"use client"

import { createContext, useContext } from "react"
import type { UseProjectDialogsResult } from "@/hooks/use-project-dialogs"

const ProjectDialogsContext = createContext<UseProjectDialogsResult | null>(null)

export function ProjectDialogsProvider({
  value,
  children,
}: {
  value: UseProjectDialogsResult
  children: React.ReactNode
}) {
  return (
    <ProjectDialogsContext.Provider value={value}>
      {children}
    </ProjectDialogsContext.Provider>
  )
}

export function useProjectDialogsContext(): UseProjectDialogsResult {
  const context = useContext(ProjectDialogsContext)
  if (!context) {
    throw new Error(
      "useProjectDialogsContext must be used within ProjectDialogsProvider"
    )
  }
  return context
}
