import React from "react"
import { Section, Field } from "../../engine/types"
import FieldEditor from "./FieldEditor"
import { ui } from "../styles"

interface Props {
  section: Section
  onUpdate: (updated: Section) => void
  onDelete: () => void
}

export default function SectionEditor({ section, onUpdate, onDelete }: Props) {
  function handleAddField() {
    const newField: Field = { name: "new_field", type: "int" }
    onUpdate({ ...section, fields: [...section.fields, newField] })
  }

  function handleUpdateField(index: number, updated: Field) {
    onUpdate({
      ...section,
      fields: section.fields.map((f, i) => i === index ? updated : f)
    })
  }

  function handleDeleteField(index: number) {
    onUpdate({
      ...section,
      fields: section.fields.filter((_, i) => i !== index)
    })
  }

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: ui.spacing.md,
    marginBottom: ui.spacing.lg,
    flexWrap: "wrap"
  }

  return (
    <div style={ui.sectionBlock}>
      <div style={headerStyle}>
        <strong style={ui.listEntryTitle}>Section</strong>
        <input
          type="text"
          value={section.name}
          onChange={e => onUpdate({ ...section, name: e.target.value })}
          style={ui.input({ width: 220 })}
          placeholder="section_name"
        />
        <button
          onClick={onDelete}
          style={ui.button("danger")}
        >
          Delete section
        </button>
      </div>

      {section.fields.map((field, i) => (
        <FieldEditor
          key={i}
          field={field}
          onUpdate={updated => handleUpdateField(i, updated)}
          onDelete={() => handleDeleteField(i)}
        />
      ))}

      <button onClick={handleAddField} style={ui.button("neutral")}>+ Add Field</button>
    </div>
  )
}
