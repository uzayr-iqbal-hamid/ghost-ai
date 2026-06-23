"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { ProjectSummary } from "@/lib/projects"
import { useProjectDialogsContext } from "./project-dialogs-context"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  owned: ProjectSummary[]
  shared: ProjectSummary[]
  activeProjectId?: string | null
}

export function ProjectSidebar({
  isOpen,
  onClose,
  owned,
  shared,
  activeProjectId,
}: ProjectSidebarProps) {
  const { openCreate, openRename, openDelete } = useProjectDialogsContext()

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200 md:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      />
      <div
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-72 flex-col border-r border-surface-border bg-surface transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <span className="text-sm font-medium text-copy-primary">
            Projects
          </span>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs
          defaultValue="my-projects"
          className="flex flex-1 flex-col overflow-hidden"
        >
          <TabsList className="mx-4 mt-3 w-auto">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>

          <TabsContent
            value="my-projects"
            className="flex-1 overflow-y-auto p-2"
          >
            {owned.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <span className="text-sm text-copy-muted">No projects yet</span>
              </div>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {owned.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    isActive={project.id === activeProjectId}
                    onRename={() => openRename(project)}
                    onDelete={() => openDelete(project)}
                  />
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="shared" className="flex-1 overflow-y-auto p-2">
            {shared.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <span className="text-sm text-copy-muted">
                  No shared projects
                </span>
              </div>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {shared.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    isActive={project.id === activeProjectId}
                  />
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>

        <div className="border-t border-surface-border p-4">
          <Button className="w-full" variant="default" onClick={openCreate}>
            <Plus className="h-5 w-5" />
            New Project
          </Button>
        </div>
      </div>
    </>
  )
}

interface ProjectItemProps {
  project: ProjectSummary
  isActive?: boolean
  onRename?: () => void
  onDelete?: () => void
}

function ProjectItem({
  project,
  isActive,
  onRename,
  onDelete,
}: ProjectItemProps) {
  const hasActions = Boolean(onRename || onDelete)

  return (
    <li
      className={cn(
        "group flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-elevated",
        isActive && "bg-elevated",
      )}
    >
      <a
        href={`/editor/${project.id}`}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex-1 truncate text-sm hover:text-copy-primary",
          isActive ? "text-copy-primary" : "text-copy-secondary",
        )}
      >
        {project.name}
      </a>
      {hasActions && (
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          {onRename && (
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={`Rename ${project.name}`}
              onClick={onRename}
            >
              <Pencil className="h-3 w-3" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={`Delete ${project.name}`}
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </li>
  )
}
