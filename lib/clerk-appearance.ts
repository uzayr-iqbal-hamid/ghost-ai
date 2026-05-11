import { dark } from "@clerk/ui/themes"
import type { Appearance } from "@clerk/ui"

export const clerkAppearance: Appearance = {
  theme: dark,
  variables: {
    colorBackground: "var(--bg-surface)",
    colorForeground: "var(--text-primary)",
    colorPrimary: "var(--accent-primary)",
    colorPrimaryForeground: "var(--bg-base)",
    colorInput: "var(--bg-elevated)",
    colorInputForeground: "var(--text-primary)",
    colorMuted: "var(--bg-subtle)",
    colorMutedForeground: "var(--text-muted)",
    colorBorder: "var(--border-default)",
    colorRing: "var(--accent-primary)",
    colorNeutral: "var(--text-secondary)",
    colorDanger: "var(--state-error)",
    colorSuccess: "var(--state-success)",
    colorWarning: "var(--state-warning)",
    fontFamily: "var(--font-geist-sans)",
  },
}
