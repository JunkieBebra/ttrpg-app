// ─── Field types ────────────────────────────────────────────────────────────

export type FieldType = "string" | "int" | "float" | "derived" | "check" | "list"

export interface Field {
  name: string
  type: FieldType
  formula?: string  // required if type is "derived" or "check", absent otherwise
  description?: string  // optional human-readable note
  schema?: Omit<Field, "schema">[] 
}

// ─── Template ───────────────────────────────────────────────────────────────

export interface Section {
  name: string
  fields: Field[]
}

export interface Template {
  name: string
  version: string   // e.g. "1.0.0" — useful when you evolve templates later
  sections: Section[]
}

// ─── Character ──────────────────────────────────────────────────────────────

// A raw value is what the user actually typed in — only editable fields have these
export type RawValue = string | number

// Keys are dot-notation paths: "attributes.strength", "identity.name"
export type RawValues = Record<string, RawValue>

export interface CustomCheck {
  id: string
  name: string
  formula: string
  description?: string
}

export interface Character {
  name: string
  templateName: string
  templateFile: string
  values: RawValues
  customChecks: CustomCheck[]
}

// ─── Resolved character (runtime only, never saved to disk) ─────────────────

// Same as RawValues but includes derived and check fields too
export type ResolvedValues = Record<string, RawValue>

export interface ResolvedCharacter extends Character {
  resolved: ResolvedValues
}