"use client"

import { Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AiSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
  return (
    <aside
      aria-label="AI assistant"
      aria-hidden={!isOpen}
      className={cn(
        "fixed top-12 right-0 z-30 flex h-[calc(100vh-3rem)] w-80 flex-col border-l border-surface-border bg-surface transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-ai-text" />
          <span className="text-sm font-medium text-copy-primary">
            AI assistant
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close AI sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <p className="text-sm text-copy-muted">
          AI chat will live here. Coming soon.
        </p>
      </div>
    </aside>
  )
}
