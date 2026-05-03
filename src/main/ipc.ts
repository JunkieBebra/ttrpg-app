import { ipcMain } from "electron"
import { resolve } from "../engine/engine"
import {
  initDirectories,
  loadTemplate,
  listTemplates,
  saveCharacter,
  loadCharacter,
  listCharacters,
  deleteCharacter
} from "../engine/persistence"
import { Template, Character } from "../engine/types"
import { saveConfig, loadConfig } from "../engine/persistence"
import { saveTemplate } from "../engine/persistence"

initDirectories()

ipcMain.handle("list-templates",  () => listTemplates())
ipcMain.handle("list-characters", () => listCharacters())

ipcMain.handle("load-template",  (_, filename: string) => loadTemplate(filename))
ipcMain.handle("load-character", (_, filename: string) => loadCharacter(filename))

ipcMain.handle("resolve-character", (_, template: Template, character: Character) => {
  return resolve(template, character)
})

ipcMain.handle("save-character", (_, character: Character, filename: string) => {
  return saveCharacter(character, filename)
})

ipcMain.handle("delete-character", (_, filename: string) => {
  return deleteCharacter(filename)
})

ipcMain.handle("save-config", (_, config: Record<string, string>) => saveConfig(config))
ipcMain.handle("load-config", () => loadConfig())

ipcMain.handle("save-template", (_, template: Template, filename: string) => {
  return saveTemplate(template, filename)
})