import Link from "next/link"
import { Sparkles, Share2, FileText, type LucideIcon } from "lucide-react"

interface AuthFeature {
  icon: LucideIcon
  title: string
  description: string
}

const features: AuthFeature[] = [
  {
    icon: Sparkles,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
]

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-base font-sans text-copy-primary lg:grid-cols-2">
      <aside className="hidden border-r border-surface-border bg-surface lg:flex lg:flex-col lg:justify-between lg:px-16 lg:py-12">
        <Link href="/" className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block h-8 w-8 rounded-xl bg-brand"
          />
          <span className="text-lg font-semibold tracking-tight text-copy-primary">
            Ghost AI
          </span>
        </Link>

        <div className="space-y-12">
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-copy-primary">
              Design systems at the
              <br />
              speed of thought.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-copy-secondary">
              Describe your architecture in plain English. Ghost AI maps it to a
              shared canvas your whole team can refine in real time.
            </p>
          </div>

          <ul className="space-y-6">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-dim text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-copy-primary">
                    {title}
                  </p>
                  <p className="max-w-md text-sm leading-relaxed text-copy-muted">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-copy-faint">
          © {new Date().getFullYear()} Ghost AI. All rights reserved.
        </p>
      </aside>

      <main className="flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  )
}
