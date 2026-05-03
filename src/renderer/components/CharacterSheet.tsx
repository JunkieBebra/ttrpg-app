import React from "react"
import { Template, Character, ResolvedCharacter, RawValues, CustomCheck } from "../../engine/types"
import CustomChecksSection from "./CustomChecksSection"
import SectionBlock from "./SectionBlock"
import { ui } from "../styles"


interface Props {
  template: Template
  character: Character
  resolved: ResolvedCharacter
  onChange: (updated: Character) => void
  onSave: () => void
}

export default function CharacterSheet({ template, character, resolved, onChange, onSave }: Props) {

  function handleFieldChange(path: string, value: string | number) {
    onChange({
      ...character,
      values: { ...character.values, [path]: value }
    })
  }
  function handleAddEntry(path: string) {
    // Find current count for this list
    const prefix = `${path}_`
    const indices = Object.keys(character.values)
      .filter(k => k.startsWith(prefix))
      .map(k => parseInt(k.replace(prefix, "").split("_")[0]))
      .filter(n => !isNaN(n))
    const nextIndex = indices.length > 0 ? Math.max(...indices) + 1 : 0
  
    // Add blank entry using schema field defaults
    const template_section = template.sections
      .flatMap(s => s.fields)
      .find(f => `${template.sections.find(s => s.fields.includes(f))!.name}_${f.name}` === path)
  
    if (!template_section?.schema) return
  
    const newValues = { ...character.values }
    for (const schemaField of template_section.schema) {
      const entryPath = `${path}_${nextIndex}_${schemaField.name}`
      newValues[entryPath] = schemaField.type === "int" || schemaField.type === "float" ? 0 : ""
    }
  
    onChange({ ...character, values: newValues })
  }

  function handleCustomChecksChange(updated: CustomCheck[]) {
    onChange({ ...character, customChecks: updated })
  }
  
  function handleDeleteEntry(path: string, index: number) {
    // Remove all keys for this entry and re-index remaining entries
    const prefix = `${path}_${index}_`
    const newValues: RawValues = {}
  
    // Collect entries that are not the deleted one, re-indexed
    const allIndices = Object.keys(character.values)
      .filter(k => k.startsWith(`${path}_`))
      .map(k => parseInt(k.replace(`${path}_`, "").split("_")[0]))
      .filter(n => !isNaN(n))
    const uniqueIndices = [...new Set(allIndices)].filter(i => i !== index).sort((a, b) => a - b)
  
    // Copy non-list values untouched
    for (const [k, v] of Object.entries(character.values)) {
      if (!k.startsWith(`${path}_`)) newValues[k] = v
    }
  
    // Re-index remaining entries
    uniqueIndices.forEach((oldIndex, newIndex) => {
      for (const k of Object.keys(character.values).filter(k => k.startsWith(`${path}_${oldIndex}_`))) {
        const newKey = k.replace(`${path}_${oldIndex}_`, `${path}_${newIndex}_`)
        newValues[newKey] = character.values[k]
      }
    })
  
    onChange({ ...character, values: newValues })
  }

  return (
    <div>
      {template.sections.map(section => (
        <SectionBlock
          key={section.name}
          section={section}
          resolved={resolved}
          onFieldChange={handleFieldChange}
          onAddEntry={handleAddEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      ))}
      <CustomChecksSection
        checks={character.customChecks ?? []}
        resolved={resolved}
        onChange={handleCustomChecksChange}
      />
      <button
        onClick={onSave}
        style={ui.button("primary", { ...ui.characterActionButton, marginTop: ui.spacing.xl })}
      >
        Save character
      </button>
    </div>
  )
}
