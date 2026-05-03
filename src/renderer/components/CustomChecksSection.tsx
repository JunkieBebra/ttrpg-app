import React, { useState } from "react"
import { CustomCheck, ResolvedCharacter } from "../../engine/types"
import { isError } from "../utils"
import { evaluate } from "../../engine/evaluator"
import { ui } from "../styles"

interface Props {
  checks: CustomCheck[]
  resolved: ResolvedCharacter
  onChange: (updated: CustomCheck[]) => void
}

interface EditState {
  name: string
  formula: string
  description: string
}

function validateFormula(formula: string, resolved: ResolvedCharacter): string | null {
  if (!formula.trim()) return "Formula is empty"
  const result = evaluate(formula, resolved.resolved)
  if (isError(result)) return result as string
  return null
}

const inputFullWidth: React.CSSProperties = {
  ...ui.input(),
  width: "100%",
  boxSizing: "border-box"
}

export default function CustomChecksSection({ checks, resolved, onChange }: Props) {
  const [showForm, setShowForm]     = useState(false)
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [editState, setEditState]   = useState<EditState>({ name: "", formula: "", description: "" })
  const [checkResults, setCheckResults] = useState<Record<string, string | number>>({})

  function handleAdd() {
    setEditingId(null)
    setEditState({ name: "", formula: "", description: "" })
    setShowForm(true)
  }

  function handleEdit(check: CustomCheck) {
    setEditingId(check.id)
    setEditState({ name: check.name, formula: check.formula, description: check.description ?? "" })
    setShowForm(true)
  }

  function handleConfirm() {
    const { name, formula, description } = editState
    if (!name.trim() || !formula.trim()) return

    if (editingId) {
      onChange(checks.map(c => c.id === editingId
        ? { ...c, name, formula, description }
        : c
      ))
    } else {
      const newCheck: CustomCheck = {
        id: Date.now().toString(),
        name,
        formula,
        description
      }
      onChange([...checks, newCheck])
    }
    setShowForm(false)
    setEditingId(null)
  }

  function handleDelete(check: CustomCheck) {
    const confirmed = window.confirm(`Delete "${check.name}"?`)
    if (!confirmed) return

    onChange(checks.filter(c => c.id !== check.id))
    const updated = { ...checkResults }
    delete updated[check.id]
    setCheckResults(updated)
  }

  function handleCompute(check: CustomCheck) {
    const result = evaluate(check.formula, resolved.resolved)
    setCheckResults(prev => ({ ...prev, [check.id]: result }))
  }

  const formulaError = editState.formula
    ? validateFormula(editState.formula, resolved)
    : null

  return (
    <div style={ui.sectionBlock}>
      <h2 style={ui.sectionTitle}>Custom Checks</h2>

      {checks.map(check => {
        const result = checkResults[check.id]
        return (
          <div key={check.id} style={ui.formRow}>
            <span
              style={{ ...ui.fieldLabel, cursor: check.description ? "help" : "default" }}
              title={check.description ?? ""}
            >
              {check.name}
            </span>
            <button type="button" onClick={() => handleCompute(check)} style={ui.button("neutral")}>
              Compute
            </button>
            {result !== undefined && (
              <span style={isError(result) ? ui.errorText : ui.successText}>
                {result}
              </span>
            )}
            <button type="button" onClick={() => handleEdit(check)} style={ui.button("neutral")}>
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(check)}
              style={ui.button("neutral", { color: ui.colors.danger, minWidth: 34, padding: "0 8px" })}
              title="Delete check"
            >
              ✕
            </button>
          </div>
        )
      })}

      {showForm && (
        <div style={{ ...ui.card, marginTop: ui.spacing.md, maxWidth: 520 }}>
          <strong style={{ fontSize: 15 }}>{editingId ? "Edit check" : "New check"}</strong>

          <div style={{ display: "flex", flexDirection: "column", gap: ui.spacing.sm, marginTop: ui.spacing.md }}>
            <div>
              <label style={{ ...ui.helperText, display: "block", marginBottom: ui.spacing.xs }}>Name</label>
              <input
                style={inputFullWidth}
                type="text"
                placeholder="e.g. Sword attack"
                value={editState.name}
                onChange={e => setEditState(s => ({ ...s, name: e.target.value }))}
                autoFocus
              />
            </div>

            <div>
              <label style={{ ...ui.helperText, display: "block", marginBottom: ui.spacing.xs }}>Formula</label>
              <input
                style={{
                  ...inputFullWidth,
                  borderColor: editState.formula
                    ? formulaError ? ui.colors.error : ui.colors.success
                    : undefined
                }}
                type="text"
                placeholder="e.g. attributes_strength + weapons_equipped_0_damage"
                value={editState.formula}
                onChange={e => setEditState(s => ({ ...s, formula: e.target.value }))}
              />
              {editState.formula && (
                <span style={formulaError ? ui.errorText : ui.successText}>
                  {formulaError ?? "✓ valid"}
                </span>
              )}
            </div>

            <div>
              <label style={{ ...ui.helperText, display: "block", marginBottom: ui.spacing.xs }}>
                Description (optional)
              </label>
              <input
                style={inputFullWidth}
                type="text"
                placeholder="What is this check for?"
                value={editState.description}
                onChange={e => setEditState(s => ({ ...s, description: e.target.value }))}
              />
            </div>

            <div style={{ display: "flex", gap: ui.spacing.sm, marginTop: ui.spacing.xs }}>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!editState.name.trim() || !editState.formula.trim() || !!formulaError}
                style={ui.button("primary")}
              >
                {editingId ? "Save" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null) }}
                style={ui.button("neutral")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: ui.spacing.md }}>
        <button type="button" onClick={handleAdd} style={ui.button("neutral")}>
          + Add check
        </button>
      </div>
    </div>
  )
}
