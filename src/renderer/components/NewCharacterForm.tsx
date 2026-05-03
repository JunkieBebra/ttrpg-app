import React, { useState } from "react"
import { formatFilename } from "../utils"
import { ui } from "../styles"

interface Props {
  templates: string[]
  onConfirm: (filename: string, templateFilename: string) => void
  onCancel: () => void
}

export default function NewCharacterForm({ templates, onConfirm, onCancel }: Props) {
  const [filename, setFilename]         = useState("")
  const [selectedTemplate, setTemplate] = useState(templates[0] ?? "")

  function handleConfirm() {
    const trimmed = filename.trim()
    if (!trimmed) return
    onConfirm(trimmed, selectedTemplate)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ui.spacing.md }}>
      <strong id="new-character-dialog-title" style={{ display: "block", fontSize: 16 }}>
        New character
      </strong>

      <div style={ui.formRow}>
        <label style={ui.fieldLabel}>Filename</label>
        <input
          style={{ ...ui.input(), width: 220 }}
          type="text"
          placeholder="e.g. ciri"
          value={filename}
          onChange={e => setFilename(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleConfirm() }}
          autoFocus
        />
        <span style={ui.helperText}>
          .json
        </span>
      </div>

      <div style={ui.formRow}>
        <label style={ui.fieldLabel}>Template</label>
        <select
          style={{ ...ui.input(), width: 220 }}
          value={selectedTemplate}
          onChange={e => setTemplate(e.target.value)}
        >
          {templates.map(t => (
            <option key={t} value={t}>{formatFilename(t)}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: ui.spacing.sm, marginTop: ui.spacing.sm }}>
        <button onClick={handleConfirm} style={ui.button("primary")}>Create</button>
        <button onClick={onCancel} style={ui.button("neutral")}>Cancel</button>
      </div>
    </div>
  )
}