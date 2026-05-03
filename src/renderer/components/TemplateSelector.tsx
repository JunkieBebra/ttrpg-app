import React from "react"

interface Props {
  templates: string[]
  selected: string | null
  onSelect: (filename: string) => void
}

export default function TemplateSelector({ templates, selected, onSelect }: Props) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label><strong>Template: </strong></label>
      <select
        value={selected ?? ""}
        onChange={e => onSelect(e.target.value)}
      >
        <option value="" disabled>Select a template...</option>
        {templates.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  )
}