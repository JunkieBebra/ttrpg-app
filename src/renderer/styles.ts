import React from "react"

type ButtonVariant = "primary" | "neutral" | "danger"

const colors = {
  bg: "#11151d",
  panel: "#1a202c",
  panelAlt: "#151a24",
  border: "#2c3444",
  borderMuted: "#252d3b",
  textPrimary: "#e5eaf3",
  textSecondary: "#a5afc2",
  accent: "#3b82f6",
  accentHover: "#4f8ff8",
  danger: "#ef4444",
  success: "#22c55e",
  inputBg: "#0f141d",
  inputBorder: "#374151",
  inputBorderFocus: "#4b93ff",
  error: "#f87171"
} as const

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
} as const

const radius = {
  sm: 6,
  md: 10,
  lg: 14
} as const

const typography = {
  fontFamily: `Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`,
  monoFamily: `"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace`,
  smallSize: 12
} as const

const shadows = {
  panel: "0 10px 30px rgba(0, 0, 0, 0.35)",
  modal: "0 20px 50px rgba(0, 0, 0, 0.5)"
} as const

const transitions = {
  default: "all 140ms ease"
} as const

const baseControl: React.CSSProperties = {
  height: 34,
  borderRadius: radius.sm,
  border: `1px solid ${colors.inputBorder}`,
  background: colors.inputBg,
  color: colors.textPrimary,
  colorScheme: "dark",
  fontSize: 14,
  outline: "none",
  transition: transitions.default
}

export const ui = {
  colors,
  spacing,
  radius,
  typography,

  appRoot: {
    minHeight: "100vh",
    boxSizing: "border-box",
    background: colors.bg,
    color: colors.textPrimary,
    padding: 0,
    fontFamily: typography.fontFamily,
    display: "flex"
  } satisfies React.CSSProperties,

  appShell: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "stretch"
  } satisfies React.CSSProperties,

  appContainer: {
    flex: 1,
    minWidth: 0,
    margin: 0,
    background: colors.panel,
    borderLeft: `1px solid ${colors.border}`,
    padding: spacing.xl,
    boxSizing: "border-box"
  } satisfies React.CSSProperties,

  title: {
    margin: `0 0 ${spacing.xl}px 0`,
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 0.2
  } satisfies React.CSSProperties,

  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.lg,
    flexWrap: "wrap"
  } satisfies React.CSSProperties,

  navTitle: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 0.2,
    flex: "1 1 auto",
    minWidth: 0
  } satisfies React.CSSProperties,

  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
    flexWrap: "wrap"
  } satisfies React.CSSProperties,

  selectorRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm
  } satisfies React.CSSProperties,

  characterActionButton: {
    width: 160,
    justifyContent: "center"
  } satisfies React.CSSProperties,

  sidebar: {
    width: 280,
    minWidth: 280,
    boxSizing: "border-box",
    background: colors.panelAlt,
    borderRight: `1px solid ${colors.border}`,
    padding: spacing.md,
    display: "flex",
    flexDirection: "column",
    gap: spacing.md,
    transition: transitions.default
  } satisfies React.CSSProperties,

  sidebarCollapsed: {
    width: 56,
    minWidth: 56,
    boxSizing: "border-box",
    background: colors.panelAlt,
    borderRight: `1px solid ${colors.border}`,
    padding: 0,
    display: "flex",
    marginTop: 10,
    flexDirection: "column",
    alignItems: "center",
    gap: spacing.sm,
    transition: transitions.default
  } satisfies React.CSSProperties,

  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm
  } satisfies React.CSSProperties,

  sidebarHeaderCollapsed: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  } satisfies React.CSSProperties,

  sidebarHeaderActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm
  } satisfies React.CSSProperties,

  sidebarTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.textPrimary
  } satisfies React.CSSProperties,

  sidebarList: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.xs,
    minHeight: 0,
    overflowY: "auto"
  } satisfies React.CSSProperties,

  sidebarDivider: {
    borderTop: `1px solid ${colors.border}`,
    margin: `${spacing.xs}px 0`
  } satisfies React.CSSProperties,

  sidebarSectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm
  } satisfies React.CSSProperties,

  sidebarSectionLabel: {
    fontSize: typography.smallSize,
    fontWeight: 700,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6
  } satisfies React.CSSProperties,

  sidebarItem: {
    ...baseControl,
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    width: "100%",
    height: 32,
    borderColor: "transparent",
    background: "transparent",
    cursor: "pointer",
    color: colors.textSecondary,
    padding: `0 ${spacing.sm}px`,
    textAlign: "left"
  } satisfies React.CSSProperties,

  sidebarItemActive: {
    ...baseControl,
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    width: "100%",
    height: 32,
    cursor: "pointer",
    borderColor: colors.border,
    background: colors.inputBg,
    color: colors.textPrimary,
    padding: `0 ${spacing.sm}px`,
    textAlign: "left"
  } satisfies React.CSSProperties,

  sectionBlock: {
    marginBottom: spacing.xl,
    border: `1px solid ${colors.borderMuted}`,
    borderRadius: radius.md,
    background: colors.panelAlt,
    padding: spacing.lg
  } satisfies React.CSSProperties,

  sectionTitle: {
    margin: `0 0 ${spacing.lg}px 0`,
    fontSize: 18,
    fontWeight: 600,
    color: colors.textPrimary,
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: spacing.sm
  } satisfies React.CSSProperties,

  formRow: {
    marginBottom: spacing.sm,
    display: "flex",
    alignItems: "center",
    gap: spacing.md
  } satisfies React.CSSProperties,

  fieldLabel: {
    display: "inline-block",
    width: 200,
    fontSize: 13,
    color: colors.textSecondary,
    userSelect: "none"
  } satisfies React.CSSProperties,

  fieldValueText: {
    color: colors.textSecondary,
    fontFamily: typography.monoFamily
  } satisfies React.CSSProperties,

  input(extra: React.CSSProperties = {}): React.CSSProperties {
    return {
      ...baseControl,
      padding: `0 ${spacing.sm}px`,
      ...extra
    }
  },

  button(variant: ButtonVariant = "neutral", extra: React.CSSProperties = {}): React.CSSProperties {
    const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
      primary: {
        background: colors.accent,
        borderColor: colors.accent,
        color: "#ffffff"
      },
      neutral: {
        background: colors.panelAlt,
        borderColor: colors.border,
        color: colors.textPrimary
      },
      danger: {
        background: "#3a1820",
        borderColor: "#5a2230",
        color: "#ffb3c4"
      }
    }

    return {
      ...baseControl,
      height: 34,
      padding: `0 ${spacing.md}px`,
      cursor: "pointer",
      fontWeight: 600,
      ...variantStyles[variant],
      ...extra
    }
  },

  iconButtonSquare(variant: ButtonVariant = "neutral", extra: React.CSSProperties = {}): React.CSSProperties {
    return this.button(variant, {
      width: 34,
      minWidth: 34,
      padding: 0,
      fontSize: 22,
      fontWeight: 400,
      lineHeight: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...extra
    })
  },

  card: {
    border: `1px solid ${colors.border}`,
    borderRadius: radius.md,
    padding: spacing.lg,
    background: colors.panelAlt
  } satisfies React.CSSProperties,

  listEntry: {
    border: `1px solid ${colors.border}`,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
    background: colors.panel
  } satisfies React.CSSProperties,

  listHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm
  } satisfies React.CSSProperties,

  listEntryTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.textPrimary
  } satisfies React.CSSProperties,

  helperText: {
    color: colors.textSecondary,
    fontSize: typography.smallSize
  } satisfies React.CSSProperties,

  errorText: {
    color: colors.error
  } satisfies React.CSSProperties,

  successText: {
    color: colors.success
  } satisfies React.CSSProperties,

  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    background: "rgba(0, 0, 0, 0.55)"
  } satisfies React.CSSProperties,

  modalPanel: {
    width: "100%",
    maxWidth: 460,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.md,
    padding: spacing.xl,
    background: colors.panelAlt,
    boxShadow: shadows.modal
  } satisfies React.CSSProperties
}
