import React, { useState } from "react"
import { Template, Section } from "../../engine/types"
import SectionEditor from "./SectionEditor"
import { ui } from "../styles"

interface Props {
  template: Template
  filename: string
  onChange: (updated: Template) => void
  onSave: (template: Template, filename: string) => void
}

export default function TemplateEditor({ template, filename, onChange, onSave }: Props) {
  const [draftFilename, setDraftFilename] = useState(
    filename.replace(".json", "") ?? ""
  )

  function updateTemplate(fn: (t: Template) => Template) {
    onChange(fn(template))
  }

  function handleAddSection() {
    updateTemplate(t => ({
      ...t,
      sections: [...t.sections, { name: "new_section", fields: [] }]
    }))
  }

  function handleUpdateSection(index: number, updated: Section) {
    updateTemplate(t => ({
      ...t,
      sections: t.sections.map((s, i) => i === index ? updated : s)
    }))
  }

  function handleDeleteSection(index: number) {
    updateTemplate(t => ({
      ...t,
      sections: t.sections.filter((_, i) => i !== index)
    }))
  }

  return (
    <div>
      <h2 style={ui.title}>Template Editor</h2>

      <div style={{ ...ui.sectionBlock, maxWidth: 560 }}>
        <h3 style={ui.sectionTitle}>Template Details</h3>
        <div style={ui.formRow}>
          <label style={ui.fieldLabel}>Filename</label>
          <input
            style={ui.input({ width: 220 })}
            type="text"
            value={draftFilename}
            onChange={e => setDraftFilename(e.target.value)}
            placeholder="e.g. my_homebrew"
          />
          <span style={ui.helperText}>.json</span>
        </div>
        <div style={ui.formRow}>
          <label style={ui.fieldLabel}>Display name</label>
          <input
            style={ui.input({ width: 220 })}
            type="text"
            value={template.name}
            onChange={e => updateTemplate(t => ({ ...t, name: e.target.value }))}
            placeholder="e.g. My Homebrew Game"
          />
        </div>
        <div style={ui.formRow}>
          <label style={ui.fieldLabel}>Version</label>
          <input
            style={ui.input({ width: 220 })}
            type="text"
            value={template.version}
            onChange={e => updateTemplate(t => ({ ...t, version: e.target.value }))}
            placeholder="1.0.0"
          />
        </div>
      </div>

      {/* Sections */}
      {template.sections.map((section, i) => (
        <SectionEditor
          key={i}
          section={section}
          onUpdate={updated => handleUpdateSection(i, updated)}
          onDelete={() => handleDeleteSection(i)}
        />
      ))}

      <button onClick={handleAddSection} style={ui.button("neutral", { marginBottom: ui.spacing.xl })}>
        + Add Section
      </button>

      <div>
        <button
          onClick={() => onSave(template, draftFilename)}
          disabled={!template.name || !draftFilename}
          style={ui.button("primary", ui.characterActionButton)}
        >
          Save Template
        </button>
      </div>
    </div>
  )
}
