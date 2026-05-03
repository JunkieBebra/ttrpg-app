# Smart charsheet

Smart charsheet is an Electron desktop app for creating and editing TTRPG character sheets and templates.

## Requirements

- Node.js 20 or newer is recommended.
- npm, which is included with Node.js.

## Run From Source

Install dependencies:

```bash
npm install
```

Start the app in development mode:

```bash
npm start
```

The start command builds the TypeScript/Electron sources and launches the app:

```bash
npm run build
npx electron dist/main/main.js
```

## Useful Commands

Build everything:

```bash
npm run build
```

Build only the Electron main process:

```bash
npm run build:main
```

Build only the shared engine code:

```bash
npm run build:engine
```

Build only the React renderer:

```bash
npm run build:renderer
```

## Icons

The source icon is expected at:

```bash
assets/icon.png
```

Regenerate platform icons with:

```bash
npx electron-icon-maker --input=assets/icon.png --output=assets
```

This creates:

- `assets/icons/mac/icon.icns`
- `assets/icons/win/icon.ico`
- `assets/icons/png/`

## Project Structure

- `src/main/` contains the Electron main process and IPC setup.
- `src/renderer/` contains the React UI.
- `src/engine/` contains character/template logic shared by the app.
- `assets/` contains icons and app assets.
- `dist/` is generated build output and should not be committed.

## Notes

If the macOS menu bar still says `Electron` while using `npm start`, that is normal for Electron development mode. A packaged app uses the configured product name and icons.

Packaging is configured in `package.json`, but day-to-day source development only needs `npm install` and `npm start`.
