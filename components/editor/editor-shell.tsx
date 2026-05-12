"use client"

import { useState } from "react"

import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { useProjectActions } from "@/hooks/use-project-actions"
import { ProjectDialogsProvider } from "./project-dialogs-context"
import { CreateProjectDialog } from "./create-project-dialog"
import { RenameProjectDialog } from "./rename-project-dialog"
import { DeleteProjectDialog } from "./delete-project-dialog"
import type { ProjectSummary } from "@/lib/projects"

interface EditorShellProps {
  owned: ProjectSummary[]
  shared: ProjectSummary[]
  children: React.ReactNode
}

export function EditorShell({ owned, shared, children }: EditorShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const actions = useProjectActions()

  return (
    <ProjectDialogsProvider value={actions}>
      <div className="relative h-screen w-full overflow-hidden bg-base">
        <EditorNavbar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
        <ProjectSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          owned={owned}
          shared={shared}
        />
        <main className="h-full pt-12">{children}</main>

        <CreateProjectDialog />
        <RenameProjectDialog />
        <DeleteProjectDialog />
      </div>
    </ProjectDialogsProvider>
  )
}
