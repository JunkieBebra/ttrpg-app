import React, { useEffect, useState } from "react"
import { Template, Character, ResolvedCharacter } from "../engine/types"
import { resolve } from "../engine/engine"
import CharacterSelector from "./components/CharacterSelector"
import CharacterSheet from "./components/CharacterSheet"
import NewCharacterForm from "./components/NewCharacterForm"
import { formatFilename } from "./utils"
import { ui } from "./styles"
import TemplateEditor from "./components/TemplateEditor"

const { ipcRenderer } = require("electron")

interface OpenCharacter {
  filename: string
  character: Character
}

type CharacterTemplateRef = {
  templateFile?: string
  templateName?: string
}

type ViewMode = "character" | "template"

export default function App() {
  const [templates, setTemplates]         = useState<string[]>([])
  const [characters, setCharacters]       = useState<string[]>([])
  const [template, setTemplate]           = useState<Template | null>(null)
  const [open, setOpen]                   = useState<OpenCharacter | null>(null)
  const [resolved, setResolved]           = useState<ResolvedCharacter | null>(null)
  const [showNewForm, setShowNewForm]     = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [viewMode, setViewMode]           = useState<ViewMode>("character")
  const [draftTemplate, setDraftTemplate] = useState<Template | null>(null)
  const [draftFilename, setDraftFilename] = useState<string>("")

  useEffect(() => {
    async function init() {
      const tmpls: string[] = await ipcRenderer.invoke("list-templates")
      const chars: string[] = await ipcRenderer.invoke("list-characters")
      const config = await ipcRenderer.invoke("load-config")
      const lastOpened = config.lastOpened
      const toLoad = lastOpened && chars.includes(lastOpened) ? lastOpened : chars[0]
      setTemplates(tmpls)
      setCharacters(chars)
      if (chars.length > 0) {
        try {
          const character: Character = await ipcRenderer.invoke("load-character", toLoad)
          const tmpl: Template = await loadTemplateForCharacter(character)
          setTemplate(tmpl)
          setOpen({ filename: toLoad, character })
        } catch (e) {
          console.error(`Failed to auto-load "${toLoad}":`, e)
        }
      }
    }
    init()
  }, [])

  // Keep selection valid and auto-load first sheet when needed.
  useEffect(() => {
    if (characters.length === 0) {
      setOpen(null)
      setTemplate(null)
      setResolved(null)
      return
    }

    if (open && characters.includes(open.filename)) return
    handleSelectCharacter(characters[0])
  }, [characters, open])

  // Recompute whenever character values or template change
  useEffect(() => {
    if (!template || !open) return
    setResolved(resolve(template, open.character))
  }, [template, open])

  useEffect(() => {
    if (!showNewForm) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setShowNewForm(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [showNewForm])

  async function handleSelectCharacter(filename: string) {
    setIsLoadingCharacter(true)
    setLoadError(null)
    try {
      const character: Character = await ipcRenderer.invoke("load-character", filename)
      const tmpl: Template = await loadTemplateForCharacter(character)
      setTemplate(tmpl)
      setOpen({ filename, character })
      setShowNewForm(false)
      setDraftTemplate(null)
      setDraftFilename("")
      setViewMode("character")
      await ipcRenderer.invoke("save-config", { lastOpened: filename })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setLoadError(`Failed to load "${filename}": ${message}`)
    } finally {
      setIsLoadingCharacter(false)
    }
  }

  async function loadTemplateForCharacter(character: CharacterTemplateRef): Promise<Template> {
    const candidates = new Set<string>()
    const templateFile = character.templateFile?.trim()
    const templateName = character.templateName?.trim()

    if (templateFile) candidates.add(templateFile)
    if (templateName) {
      candidates.add(templateName)
      candidates.add(templateName.endsWith(".json") ? templateName : `${templateName}.json`)
    }

    for (const filename of templates) {
      const basename = filename.replace(/\.json$/, "")
      if (
        filename === templateFile ||
        basename === templateFile ||
        filename === templateName ||
        basename === templateName
      ) {
        candidates.add(filename)
      }
    }

    for (const candidate of candidates) {
      try {
        return await ipcRenderer.invoke("load-template", candidate)
      } catch {
        // Try next candidate.
      }
    }

    throw new Error(`Template not found for character`)
  }

  async function handleCreateCharacter(filename: string, templateFilename: string) {
    const normalizedFilename = filename.endsWith(".json") ? filename : `${filename}.json`
    const tmpl: Template = await ipcRenderer.invoke("load-template", templateFilename)
    const character: Character = {
      name: filename,
      templateName: tmpl.name,
      templateFile: templateFilename,
      values: {},
      customChecks: []
    }
    await ipcRenderer.invoke("save-character", character, normalizedFilename)
    const updated: string[] = await ipcRenderer.invoke("list-characters")
    setTemplate(tmpl)
    setOpen({ filename: normalizedFilename, character })
    setCharacters(updated)
    setShowNewForm(false)
    setDraftTemplate(null)
    setDraftFilename("")
    setViewMode("character")
    await ipcRenderer.invoke("save-config", { lastOpened: normalizedFilename })
  }

  function handleValuesChange(updated: Character) {
    if (!open) return
    setOpen({ ...open, character: updated })
  }

  async function handleSave() {
    if (!open) return
    await ipcRenderer.invoke("save-character", open.character, open.filename)
    const updated: string[] = await ipcRenderer.invoke("list-characters")
    setCharacters(updated)
  }

  async function handleDeleteCharacter() {
    if (!open) return
    const confirmed = window.confirm(`Delete character "${open.filename}"?`)
    if (!confirmed) return

    try {
      await ipcRenderer.invoke("delete-character", open.filename)
      const updated: string[] = await ipcRenderer.invoke("list-characters")
      setCharacters(updated)
      setOpen(null)
      setTemplate(null)
      setResolved(null)
      setLoadError(null)
      setShowNewForm(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setLoadError(`Failed to delete "${open.filename}": ${message}`)
    }
  }

  async function handleSelectTemplate(filename: string) {
    const tmpl: Template = await ipcRenderer.invoke("load-template", filename)
    setDraftTemplate(tmpl)
    setDraftFilename(filename)
    setViewMode("template")
  }
  
  function handleNewTemplate() {
    setDraftTemplate({ name: "", version: "1.0.0", sections: [] })
    setDraftFilename("")
    setViewMode("template")
  }
  
  async function handleSaveTemplate(template: Template, filename: string) {
    await ipcRenderer.invoke("save-template", template, filename)
    const updated: string[] = await ipcRenderer.invoke("list-templates")
    setTemplates(updated)
  }

  return (
    <div style={ui.appRoot}>
      <div style={ui.appShell}>
        <CharacterSelector
          characters={characters}
          selected={viewMode === "character" ? open?.filename ?? null : null}
          onSelect={handleSelectCharacter}
          onNewCharacterClick={() => setShowNewForm(v => !v)}
          disabled={isLoadingCharacter}
          collapsed={isSidebarCollapsed}
          onToggleCollapsed={() => setIsSidebarCollapsed(v => !v)}
          isNewCharacterOpen={showNewForm}
          templates={templates}
          selectedTemplate={draftFilename || null}
          onSelectTemplate={handleSelectTemplate}
          onNewTemplateClick={handleNewTemplate}
        />

        <div style={ui.appContainer}>
        <header style={ui.navbar}>
          <h1 style={ui.navTitle}>
            {viewMode === "template"
              ? draftFilename ? formatFilename(draftFilename) : "New Template"
              : open ? formatFilename(open.filename) : "Smart Charsheet"}
          </h1>
        </header>

        {loadError && (
          <div style={{ ...ui.errorText, marginBottom: ui.spacing.lg }}>
            {loadError}
          </div>
        )}

        {showNewForm && (
          <div
            style={ui.modalBackdrop}
            onClick={e => {
              if (e.target === e.currentTarget) setShowNewForm(false)
            }}
            role="presentation"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="new-character-dialog-title"
              style={ui.modalPanel}
              onClick={e => e.stopPropagation()}
            >
              <NewCharacterForm
                templates={templates}
                onConfirm={handleCreateCharacter}
                onCancel={() => setShowNewForm(false)}
              />
            </div>
          </div>
        )}

          {viewMode === "character" && template && open && resolved && (
          <>
            <CharacterSheet
              template={template}
              character={open.character}
              resolved={resolved}
              onChange={handleValuesChange}
              onSave={handleSave}
            />
            <div style={{ marginTop: ui.spacing.lg }}>
              <button
                onClick={handleDeleteCharacter}
                style={ui.button("danger", ui.characterActionButton)}
              >
                Delete character
              </button>
            </div>
          </>
        )}
        {viewMode === "template" && draftTemplate && (
          <TemplateEditor
            template={draftTemplate}
            filename={draftFilename}
            onChange={setDraftTemplate}
            onSave={handleSaveTemplate}
          />
        )}
        </div>
      </div>
    </div>
  )
}
