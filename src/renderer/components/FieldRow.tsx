import React, { useEffect, useState } from "react"
import { Field, ResolvedCharacter } from "../../engine/types"
import { formatFieldName, isError } from "../utils"
import ListField from "./ListField"
import { ui } from "../styles"

interface Props {
  path: string
  field: Field
  resolved: ResolvedCharacter
  onFieldChange: (path: string, value: string | number) => void
  onAddEntry: (path: string) => void
  onDeleteEntry: (path: string, index: number) => void
}

export default function FieldRow({ path, field, resolved, onFieldChange, onAddEntry, onDeleteEntry }: Props) {
  const currentValue = resolved.resolved[path]

  // Auto-compute: initialise with resolved value, update whenever it changes
  const [checkResult, setCheckResult] = useState<string | number | null>(currentValue ?? null)
  useEffect(() => {
    setCheckResult(currentValue ?? null)
  }, [currentValue])

  // Tooltip wrapper — shows description on hover if present
  const label = (
    <span
      style={{ ...ui.fieldLabel, cursor: field.description ? "help" : "default" }}
      title={field.description ?? ""}
    >
      {formatFieldName(field.name)}
    </span>
  )

  if (field.type === "string") {
    return (
      <div style={ui.formRow}>
        {label}
        <input
          type="text"
          style={{ ...ui.input(), width: 280 }}
          value={(currentValue as string) ?? ""}
          onChange={e => onFieldChange(path, e.target.value)}
        />
      </div>
    )
  }

  if (field.type === "int" || field.type === "float") {
    return (
      <div style={ui.formRow}>
        {label}
        <input
          type="number"
          style={{ ...ui.input(), width: 140 }}
          value={(currentValue as number) ?? 0}
          onChange={e => onFieldChange(
            path,
            field.type === "int" ? parseInt(e.target.value) : parseFloat(e.target.value)
          )}
        />
      </div>
    )
  }

  if (field.type === "derived") {
    return (
      <div style={ui.formRow}>
        {label}
        <span style={isError(currentValue) ? ui.errorText : ui.fieldValueText}>
          {currentValue ?? "—"}
        </span>
      </div>
    )
  }

  if (field.type === "check") {
    return (
      <div style={ui.formRow}>
        {label}
        <button onClick={() => setCheckResult(currentValue)} style={ui.button("neutral")}>Compute</button>
        {checkResult !== null && (
          <span style={isError(checkResult) ? ui.errorText : ui.successText}>
            {checkResult}
          </span>
        )}
      </div>
    )
  }

  if (field.type === "list") {
    return (
      <ListField
        path={path}
        field={field}
        values={resolved.resolved}
        onChange={onFieldChange}
        onAddEntry={onAddEntry}
        onDeleteEntry={onDeleteEntry}
      />
    )
  }

  return null
}