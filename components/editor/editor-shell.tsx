"use client"

import { useState } from "react"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"
import { ProjectDialogsProvider } from "./project-dialogs-context"
import { CreateProjectDialog } from "./create-project-dialog"
import { RenameProjectDialog } from "./rename-project-dialog"
import { DeleteProjectDialog } from "./delete-project-dialog"

export function EditorShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dialogs = useProjectDialogs()

  return (
    <ProjectDialogsProvider value={dialogs}>
      <div className="relative h-screen w-full overflow-hidden bg-base">
        <EditorNavbar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
        <ProjectSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="h-full pt-12">{children}</main>

        <CreateProjectDialog />
        <RenameProjectDialog />
        <DeleteProjectDialog />
      </div>
    </ProjectDialogsProvider>
  )
}
