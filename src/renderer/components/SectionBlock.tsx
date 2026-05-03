import React from "react"
import { Section, ResolvedCharacter } from "../../engine/types"
import FieldRow from "./FieldRow"
import { formatSectionName } from "../utils"
import { ui } from "../styles"

interface Props {
  section: Section
  resolved: ResolvedCharacter
  onFieldChange: (path: string, value: string | number) => void
  onAddEntry: (path: string) => void
  onDeleteEntry: (path: string, index: number) => void
}

export default function SectionBlock({ section, resolved, onFieldChange, onAddEntry, onDeleteEntry }: Props) {
  return (
    <div style={ui.sectionBlock}>
      <h2 style={ui.sectionTitle}>
        {formatSectionName(section.name)}
      </h2>
      {section.fields.map(field => {
        const path = `${section.name}_${field.name}`
        return (
          <FieldRow
            key={path}
            path={path}
            field={field}
            resolved={resolved}
            onFieldChange={onFieldChange}
            onAddEntry={onAddEntry}
            onDeleteEntry={onDeleteEntry}
          />
        )
      })}
    </div>
  )
}