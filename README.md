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

---

## User guide

### Get started
The first thing you should add is your charsheet. For now there are no pre-built options you could use, so either take your time, either put an example sample.json (the template attached to this message) in the path: `~/.ttrpg-engine/templates`.

### The template manager
Here you can create whatever you want (the limitations are only marked by implemented functions). Basically the structure can be described as a list of attributes (just like in almost any ttrpg charsheet). You can add your own section and start adding attributes. There are currently 6 types of fields:

- `string` - just a string where you can put some info like name or description (I have not added big textboxes yet, but you still have no limitations on a size of an imput.
- `int` - numerical data without fracture part, usually attributes, or other characteristics have this type.
- `float` - numerical data with fracture part (in case you need it).
- `check` - the field which applies a formula you want. Check can be recalculated by pressing a button (It is added for future roll and random implementation. So you could roll your dices inside of a game).
- `derived` - the same as a check, but it is calculated automatically whenever you change any related fields. It can be used for modifiers, or other data if you want. The difference with `check` is there is no `calculate` option.
- `list` - the list of elements, which for now can have `string`, `int` or `float` datatype. You can specify how many and of what types there are going to be fields in your custom list. With this you can implement magic book, backpack or whatever you want. You can add and delete items from the `list` dynamically while plaing.

> Note, that it will be better if you name all fields and section in the template with lowercase letter and without a space. I haven't fixed this one yet, so better use single-word expressions for now. Like "attributes" "strength". Although, if you don't want to reference it later in formulis, you can name it whatever you like.

### Formulae
When you want to reference a field in your formula, you can do it by writing down it section name (as in template) + `_` + field name. For example: I have an attribute (section name is `attributes`) of strength (field name is `strength`) equals 10. To calculate DnD modifier, I can make a derived field with a formula: `floor((attributes_strength - 10)/2)`.
If you want to reference the list object (which you can do even in template, but it is better to do in dynamic checks which you can add in character sheet) you should use following syntaxis: `list_object_INDEX_attribute`. So for example, I have a list `inventory` with objects called `items` and an item has an attribute `attack`. I can write: `inventory_items_0_attack` to reference the attack of the first object in my inventory.

### Character sheet
Here you can fill up the template and also add custom checks or items in the lists. The formulae workflow was already discussed above.
