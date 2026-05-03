import React from "react"
import { formatFilename } from "../utils"
import { ui } from "../styles"

interface Props {
  // characters
  characters: string[]
  selected: string | null
  onSelect: (filename: string) => void
  onNewCharacterClick: () => void
  disabled?: boolean
  collapsed: boolean
  onToggleCollapsed: () => void
  isNewCharacterOpen: boolean
  // templates
  templates: string[]
  selectedTemplate: string | null
  onSelectTemplate: (filename: string) => void
  onNewTemplateClick: () => void
}

export default function CharacterSelector({
  characters,
  selected,
  onSelect,
  onNewCharacterClick,
  disabled = false,
  collapsed,
  onToggleCollapsed,
  isNewCharacterOpen,
  templates,
  selectedTemplate,
  onSelectTemplate,
  onNewTemplateClick
}: Props) {
  return (
    <aside style={collapsed ? ui.sidebarCollapsed : ui.sidebar}>
      <div style={collapsed ? ui.sidebarHeaderCollapsed : ui.sidebarHeader}>
        {!collapsed && <strong style={ui.sidebarTitle}>Characters</strong>}
        <div style={ui.sidebarHeaderActions}>
          {!collapsed && (
            <button
              type="button"
              onClick={onNewCharacterClick}
              disabled={disabled}
              style={ui.iconButtonSquare("neutral", {
                borderColor: isNewCharacterOpen ? ui.colors.accent : undefined
              })}
              aria-label={isNewCharacterOpen ? "Close new character dialog" : "New character"}
              title={isNewCharacterOpen ? "Close" : "New character"}
            >
              +
            </button>
          )}
          <button
            onClick={onToggleCollapsed}
            style={ui.button("neutral", { minWidth: 34, padding: "0 10px" })}
            title={collapsed ? "Show character menu" : "Hide character menu"}
          >
            {collapsed ? ">" : "<"}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div style={ui.sidebarList}>
          {characters.length === 0 && (
            <div style={ui.helperText}>No characters yet.</div>
          )}

          {characters.map(c => {
            const isActive = selected === c
            return (
              <button
                key={c}
                disabled={disabled}
                onClick={() => onSelect(c)}
                style={isActive ? ui.sidebarItemActive : ui.sidebarItem}
                title={formatFilename(c)}
              >
                {formatFilename(c)}
              </button>
            )
          })}
            
        </div>
      )}
      {!collapsed && (
        <>
          <div style={ui.sidebarDivider} />
          <div style={ui.sidebarSectionHeader}>
            <span style={ui.sidebarSectionLabel}>
              Templates
            </span>
            <button
              type="button"
              onClick={onNewTemplateClick}
              style={ui.iconButtonSquare("neutral")}
              title="New template"
              aria-label="New template"
            >
              +
            </button>
          </div>
          {templates.map(t => (
            <button
              type="button"
              key={t}
              onClick={() => onSelectTemplate(t)}
              style={selectedTemplate === t ? ui.sidebarItemActive : ui.sidebarItem}
              title={formatFilename(t)}
            >
              {formatFilename(t)}
            </button>
          ))}
        </>
      )}
    </aside>
  )
}
