import { app, BrowserWindow, Menu } from "electron"
import * as path from "path"
import "./ipc"

const APP_NAME = "Smart charsheet"

function getIconPath(): string {
  const base = path.join(__dirname, "../../assets")
  switch (process.platform) {
    case "darwin": return path.join(base, "icons/mac/icon.icns")
    case "win32":  return path.join(base, "icons/win/icon.ico")
    default:       return path.join(base, "icon.png")
  }
}

function getDockIconPath(): string {
  return path.join(__dirname, "../../assets/icons/png/1024x1024.png")
}

function configureAppMenu(): void {
  if (process.platform !== "darwin") return

  app.setAboutPanelOptions({
    applicationName: APP_NAME,
    applicationVersion: app.getVersion()
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: APP_NAME,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        { type: "separator" },
        { role: "front" }
      ]
    }
  ]))
}

app.setName(APP_NAME)

function createWindow(): void {
  const win = new BrowserWindow({
    title: APP_NAME,
    icon: getIconPath(),
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  win.loadFile(path.join(__dirname, "../renderer/index.html"))
}

app.whenReady().then(() => {
  if (process.platform === "darwin") {
    app.dock?.setIcon(getDockIconPath())
  }
  configureAppMenu()
  createWindow()
})
app.on("window-all-closed", () => app.quit())
