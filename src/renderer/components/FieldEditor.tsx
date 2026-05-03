import React from "react"
import { Field, FieldType } from "../../engine/types"
import { evaluate } from "../../engine/evaluator"
import { isError } from "../utils"
import { ui } from "../styles"

interface Props {
  field: Field
  onUpdate: (updated: Field) => void
  onDelete: () => void
}

const FIELD_TYPES: FieldType[] = ["string", "int", "float", "derived", "check", "list"]
const SCHEMA_TYPES: FieldType[] = ["string", "int", "float"]

export default function FieldEditor({ field, onUpdate, onDelete }: Props) {
  function handleTypeChange(type: FieldType) {
    const updated: Field = { name: field.name, type }
    if (type === "list") updated.schema = []
    onUpdate(updated)
  }

  function handleAddSchemaField() {
    const newSchema = [...(field.schema ?? []), { name: "new_field", type: "string" as FieldType }]
    onUpdate({ ...field, schema: newSchema })
  }

  function handleUpdateSchemaField(index: number, changes: Partial<Field>) {
    const updated = (field.schema ?? []).map((f, i) => i === index ? { ...f, ...changes } : f)
    onUpdate({ ...field, schema: updated })
  }

  function handleDeleteSchemaField(index: number) {
    onUpdate({ ...field, schema: (field.schema ?? []).filter((_, i) => i !== index) })
  }

  const formulaValid = field.formula
    ? !isError(evaluate(field.formula, {}))
    : null

  const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: ui.spacing.sm,
    marginBottom: ui.spacing.sm,
    flexWrap: "wrap"
  }

  const containerStyle: React.CSSProperties = {
    ...ui.listEntry,
    background: ui.colors.inputBg
  }

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        {/* Name */}
        <input
          style={ui.input({ width: 160 })}
          type="text"
          value={field.name}
          onChange={e => onUpdate({ ...field, name: e.target.value })}
          placeholder="field_name"
        />

        {/* Type */}
        <select
          style={ui.input()}
          value={field.type}
          onChange={e => handleTypeChange(e.target.value as FieldType)}
        >
          {FIELD_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Description */}
        <input
          style={ui.input({ flex: 1, minWidth: 180 })}
          type="text"
          value={field.description ?? ""}
          onChange={e => onUpdate({ ...field, description: e.target.value })}
          placeholder="description (optional)"
        />

        {/* Delete */}
        <button
          onClick={onDelete}
          style={ui.button("neutral", { color: ui.colors.danger, minWidth: 34, padding: "0 8px" })}
          title="Delete field"
        >
          ✕
        </button>
      </div>

      {/* Formula — only for derived and check */}
      {(field.type === "derived" || field.type === "check") && (
        <div style={{ ...rowStyle, marginTop: ui.spacing.xs }}>
          <span style={{ ...ui.fieldLabel, width: 72 }}>Formula</span>
          <input
            style={ui.input({
              flex: 1,
              minWidth: 240,
              borderColor: field.formula
                ? formulaValid ? ui.colors.success : ui.colors.error
                : undefined
            })}
            type="text"
            value={field.formula ?? ""}
            onChange={e => onUpdate({ ...field, formula: e.target.value })}
            placeholder="e.g. floor((attributes_wisdom - 10) / 2)"
          />
          {field.formula && (
            <span style={formulaValid ? ui.successText : ui.errorText}>
              {formulaValid ? "✓ valid" : "✗ invalid"}
            </span>
          )}
        </div>
      )}

      {/* Schema — only for list */}
      {field.type === "list" && (
        <div style={{ marginTop: ui.spacing.sm, paddingLeft: ui.spacing.md, borderLeft: `2px solid ${ui.colors.border}` }}>
          <strong style={ui.helperText}>Schema fields</strong>
          {(field.schema ?? []).map((schemaField, i) => (
            <div key={i} style={{ ...rowStyle, marginTop: ui.spacing.sm }}>
              <input
                style={ui.input({ width: 150 })}
                type="text"
                value={schemaField.name}
                onChange={e => handleUpdateSchemaField(i, { name: e.target.value })}
                placeholder="field_name"
              />
              <select
                style={ui.input()}
                value={schemaField.type}
                onChange={e => handleUpdateSchemaField(i, { type: e.target.value as FieldType })}
              >
                {SCHEMA_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                style={ui.input({ flex: 1, minWidth: 180 })}
                type="text"
                value={schemaField.description ?? ""}
                onChange={e => handleUpdateSchemaField(i, { description: e.target.value })}
                placeholder="description (optional)"
              />
              <button
                onClick={() => handleDeleteSchemaField(i)}
                style={ui.button("neutral", { color: ui.colors.danger, minWidth: 34, padding: "0 8px" })}
                title="Delete schema field"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={handleAddSchemaField}
            style={ui.button("neutral", { marginTop: ui.spacing.sm })}
          >
            + Add schema field
          </button>
        </div>
      )}
    </div>
  )
}
