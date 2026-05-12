"use client"

import { createContext, useContext } from "react"

import type { UseProjectActionsResult } from "@/hooks/use-project-actions"

const ProjectDialogsContext = createContext<UseProjectActionsResult | null>(
  null,
)

export function ProjectDialogsProvider({
  value,
  children,
}: {
  value: UseProjectActionsResult
  children: React.ReactNode
}) {
  return (
    <ProjectDialogsContext.Provider value={value}>
      {children}
    </ProjectDialogsContext.Provider>
  )
}

export function useProjectDialogsContext(): UseProjectActionsResult {
  const context = useContext(ProjectDialogsContext)
  if (!context) {
    throw new Error(
      "useProjectDialogsContext must be used within ProjectDialogsProvider",
    )
  }
  return context
}
