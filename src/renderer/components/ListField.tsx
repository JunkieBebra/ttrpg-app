import React from "react"
import { Field, RawValues } from "../../engine/types"
import { formatFieldName } from "../utils"
import { ui } from "../styles"

interface Props {
  path: string
  field: Field
  values: RawValues
  onChange: (path: string, value: string | number) => void
  onDeleteEntry: (path: string, index: number) => void
  onAddEntry: (path: string) => void
}

export default function ListField({ path, field, values, onChange, onDeleteEntry, onAddEntry }: Props) {
  if (!field.schema) return null

  // Find how many entries exist by scanning values for this list's keys
  const indices = Object.keys(values)
    .filter(k => k.startsWith(`${path}_`) && k.split("_").length === path.split("_").length + 2)
    .map(k => parseInt(k.split("_")[path.split("_").length]))
    .filter(n => !isNaN(n))
  const count = indices.length > 0 ? Math.max(...indices) + 1 : 0

  return (
    <div style={{ marginBottom: ui.spacing.sm }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={ui.listEntry}>
          <div style={ui.listHeaderRow}>
            <strong style={ui.listEntryTitle}>
              {values[`${path}_${i}_name`] || `Entry ${i + 1}`}
            </strong>
            <button
              onClick={() => {
                const entryLabel = String(values[`${path}_${i}_name`] || `Entry ${i + 1}`)
                const confirmed = window.confirm(`Delete "${entryLabel}"?`)
                if (!confirmed) return
                onDeleteEntry(path, i)
              }}
              style={ui.button("neutral", {
                height: 26,
                padding: "0 8px",
                color: ui.colors.danger
              })}
            >
              ✕
            </button>
          </div>

          {field.schema!.map(schemaField => {
            const entryPath = `${path}_${i}_${schemaField.name}`
            const value = values[entryPath]

            return (
              <div key={schemaField.name} style={ui.formRow}>
                <span style={{ ...ui.fieldLabel, width: 140, fontSize: ui.typography.smallSize }}>
                  {formatFieldName(schemaField.name)}
                </span>
                <input
                  type={schemaField.type === "int" || schemaField.type === "float" ? "number" : "text"}
                  value={(value as string | number) ?? ""}
                  style={{ ...ui.input(), flex: 1 }}
                  onChange={e => onChange(
                    entryPath,
                    schemaField.type === "int" ? parseInt(e.target.value) :
                    schemaField.type === "float" ? parseFloat(e.target.value) :
                    e.target.value
                  )}
                />
              </div>
            )
          })}
        </div>
      ))}

      <button onClick={() => onAddEntry(path)} style={ui.button("neutral")}>
        + Add {formatFieldName(field.name)}
      </button>
    </div>
  )
}