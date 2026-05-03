"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDirectories = initDirectories;
exports.loadTemplate = loadTemplate;
exports.listTemplates = listTemplates;
exports.saveCharacter = saveCharacter;
exports.loadCharacter = loadCharacter;
exports.listCharacters = listCharacters;
exports.deleteCharacter = deleteCharacter;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
// ── App data directory ───────────────────────────────────────────────────────
// In Electron this will be replaced with app.getPath('userData')
const APP_DIR = path.join(os.homedir(), ".ttrpg-engine");
const TEMPLATE_DIR = path.join(APP_DIR, "templates");
const CHARACTER_DIR = path.join(APP_DIR, "characters");
function initDirectories() {
    [APP_DIR, TEMPLATE_DIR, CHARACTER_DIR].forEach(dir => {
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
    });
}
// ── Templates ────────────────────────────────────────────────────────────────
function loadTemplate(filename) {
    const filepath = path.join(TEMPLATE_DIR, filename);
    if (!fs.existsSync(filepath)) {
        throw new Error(`Template not found: ${filename}`);
    }
    return JSON.parse(fs.readFileSync(filepath, "utf-8"));
}
function listTemplates() {
    if (!fs.existsSync(TEMPLATE_DIR))
        return [];
    return fs.readdirSync(TEMPLATE_DIR)
        .filter(f => f.endsWith(".json"));
}
// ── Characters ───────────────────────────────────────────────────────────────
function buildCharacterPath(characterName) {
    const base = characterName.toLowerCase().replace(/\s+/g, "_");
    let filepath = path.join(CHARACTER_DIR, `${base}.json`);
    let counter = 2;
    // Handle name collisions — geralt.json, geralt_2.json, geralt_3.json ...
    while (fs.existsSync(filepath)) {
        const existing = JSON.parse(fs.readFileSync(filepath, "utf-8"));
        // If the file belongs to this character already, reuse it
        if (existing.name === characterName)
            return filepath;
        filepath = path.join(CHARACTER_DIR, `${base}_${counter}.json`);
        counter++;
    }
    return filepath;
}
function saveCharacter(character) {
    initDirectories();
    const filepath = buildCharacterPath(character.name);
    fs.writeFileSync(filepath, JSON.stringify(character, null, 2), "utf-8");
    return filepath;
}
function loadCharacter(filename) {
    const filepath = path.join(CHARACTER_DIR, filename);
    if (!fs.existsSync(filepath)) {
        throw new Error(`Character not found: ${filename}`);
    }
    return JSON.parse(fs.readFileSync(filepath, "utf-8"));
}
function listCharacters() {
    if (!fs.existsSync(CHARACTER_DIR))
        return [];
    return fs.readdirSync(CHARACTER_DIR)
        .filter(f => f.endsWith(".json"));
}
function deleteCharacter(filename) {
    const filepath = path.join(CHARACTER_DIR, filename);
    if (!fs.existsSync(filepath)) {
        throw new Error(`Character not found: ${filename}`);
    }
    fs.unlinkSync(filepath);
}
