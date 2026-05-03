import * as fs from "fs"
import * as path from "path"
import * as os from "os"
import type { Template, Character } from "./types.js"

// ── App data directory ───────────────────────────────────────────────────────
// In Electron this will be replaced with app.getPath('userData')
const APP_DIR     = path.join(os.homedir(), ".ttrpg-engine")
const TEMPLATE_DIR = path.join(APP_DIR, "templates")
const CHARACTER_DIR = path.join(APP_DIR, "characters")

export function initDirectories(): void {
  [APP_DIR, TEMPLATE_DIR, CHARACTER_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  })
}

// ── Templates ────────────────────────────────────────────────────────────────

export function loadTemplate(filename: string): Template {
  const filepath = path.join(TEMPLATE_DIR, filename)
  if (!fs.existsSync(filepath)) {
    throw new Error(`Template not found: ${filename}`)
  }
  return JSON.parse(fs.readFileSync(filepath, "utf-8")) as Template
}

export function listTemplates(): string[] {
  if (!fs.existsSync(TEMPLATE_DIR)) return []
  return fs.readdirSync(TEMPLATE_DIR)
    .filter((f: string) => f.endsWith(".json"))
}

// ── Characters ───────────────────────────────────────────────────────────────

function buildCharacterPath(characterName: string): string {
  const base = characterName.toLowerCase().replace(/\s+/g, "_")
  let filepath = path.join(CHARACTER_DIR, `${base}.json`)
  let counter = 2

  // Handle name collisions — geralt.json, geralt_2.json, geralt_3.json ...
  while (fs.existsSync(filepath)) {
    const existing: Character = JSON.parse(fs.readFileSync(filepath, "utf-8"))
    // If the file belongs to this character already, reuse it
    if (existing.name === characterName) return filepath
    filepath = path.join(CHARACTER_DIR, `${base}_${counter}.json`)
    counter++
  }

  return filepath
}

export function saveCharacter(character: Character, filename: string): string {
  initDirectories()
  // Ensure .json extension
  const base = filename.endsWith(".json") ? filename : `${filename}.json`
  const filepath = path.join(CHARACTER_DIR, base)
  fs.writeFileSync(filepath, JSON.stringify(character, null, 2), "utf-8")
  return filepath
}

export function loadCharacter(filename: string): Character {
  const filepath = path.join(CHARACTER_DIR, filename)
  if (!fs.existsSync(filepath)) {
    throw new Error(`Character not found: ${filename}`)
  }
  return JSON.parse(fs.readFileSync(filepath, "utf-8")) as Character
}

export function listCharacters(): string[] {
  if (!fs.existsSync(CHARACTER_DIR)) return []
  return fs.readdirSync(CHARACTER_DIR)
    .filter((f: string) => f.endsWith(".json"))
}

export function deleteCharacter(filename: string): void {
  const filepath = path.join(CHARACTER_DIR, filename)
  if (!fs.existsSync(filepath)) {
    throw new Error(`Character not found: ${filename}`)
  }
  fs.unlinkSync(filepath)
}

const CONFIG_PATH = path.join(APP_DIR, "config.json")

export function saveConfig(config: Record<string, string>): void {
  initDirectories()
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8")
}

export function loadConfig(): Record<string, string> {
  if (!fs.existsSync(CONFIG_PATH)) return {}
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"))
}

export function saveTemplate(template: Template, filename: string): string {
  initDirectories()
  const base = filename.endsWith(".json") ? filename : `${filename}.json`
  const filepath = path.join(TEMPLATE_DIR, base)
  fs.writeFileSync(filepath, JSON.stringify(template, null, 2), "utf-8")
  return filepath
}