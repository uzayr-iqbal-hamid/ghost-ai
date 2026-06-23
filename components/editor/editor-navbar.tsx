"use client"

import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Share2,
} from "lucide-react"
import { UserButton } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"

interface EditorNavbarProps {
  isOpen: boolean
  onToggle: () => void
  activeProject?: { id: string; name: string } | null
  onShare?: () => void
  aiSidebarOpen?: boolean
  onToggleAiSidebar?: () => void
}

export function EditorNavbar({
  isOpen,
  onToggle,
  activeProject,
  onShare,
  aiSidebarOpen,
  onToggleAiSidebar,
}: EditorNavbarProps) {
  return (
    <nav className="fixed top-0 right-0 left-0 z-40 flex h-12 items-center border-b border-surface-border bg-surface px-3">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
        {activeProject && (
          <span className="truncate text-sm font-medium text-copy-primary">
            {activeProject.name}
          </span>
        )}
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        {activeProject && (
          <>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Share project"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleAiSidebar}
              aria-label={
                aiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"
              }
            >
              {aiSidebarOpen ? (
                <PanelRightClose className="h-5 w-5" />
              ) : (
                <PanelRightOpen className="h-5 w-5" />
              )}
            </Button>
          </>
        )}
        <UserButton />
      </div>
    </nav>
  )
}
