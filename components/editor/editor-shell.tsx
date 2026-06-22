"use client"

import { useMemo, useState } from "react"
import { usePathname } from "next/navigation"

import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { useProjectActions } from "@/hooks/use-project-actions"
import { ProjectDialogsProvider } from "./project-dialogs-context"
import { CreateProjectDialog } from "./create-project-dialog"
import { RenameProjectDialog } from "./rename-project-dialog"
import { DeleteProjectDialog } from "./delete-project-dialog"
import { AiSidebar } from "./ai-sidebar"
import { ShareDialog } from "./share-dialog"
import { cn } from "@/lib/utils"
import type { ProjectSummary } from "@/lib/projects"

interface EditorShellProps {
  owned: ProjectSummary[]
  shared: ProjectSummary[]
  children: React.ReactNode
}

const WORKSPACE_PATH = /^\/editor\/([^/]+)/

export function EditorShell({ owned, shared, children }: EditorShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const pathname = usePathname()
  const actions = useProjectActions()

  const activeProjectId = useMemo(() => {
    const match = pathname?.match(WORKSPACE_PATH)
    return match?.[1] ?? null
  }, [pathname])

  const activeProject = useMemo(() => {
    if (!activeProjectId) return null
    return (
      owned.find((p) => p.id === activeProjectId) ??
      shared.find((p) => p.id === activeProjectId) ??
      null
    )
  }, [activeProjectId, owned, shared])

  const isOwner = useMemo(
    () =>
      activeProjectId !== null &&
      owned.some((p) => p.id === activeProjectId),
    [activeProjectId, owned],
  )

  return (
    <ProjectDialogsProvider value={actions}>
      <div className="relative h-screen w-full overflow-hidden bg-base">
        <EditorNavbar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
          activeProject={activeProject}
          onShare={() => setShareOpen(true)}
          aiSidebarOpen={aiSidebarOpen}
          onToggleAiSidebar={() => setAiSidebarOpen((prev) => !prev)}
        />
        <ProjectSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          owned={owned}
          shared={shared}
          activeProjectId={activeProjectId}
        />
        <main
          className={cn(
            "h-full pt-12 transition-[padding] duration-200 ease-in-out",
            aiSidebarOpen && activeProject ? "pr-80" : "pr-0",
          )}
        >
          {children}
        </main>
        <AiSidebar
          isOpen={aiSidebarOpen && Boolean(activeProject)}
          onClose={() => setAiSidebarOpen(false)}
        />

        <ShareDialog
          open={shareOpen && Boolean(activeProject)}
          onOpenChange={setShareOpen}
          project={activeProject}
          isOwner={isOwner}
        />

        <CreateProjectDialog />
        <RenameProjectDialog />
        <DeleteProjectDialog />
      </div>
    </ProjectDialogsProvider>
  )
}
