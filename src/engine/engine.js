"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolve = resolve;
const evaluator_js_1 = require("./evaluator.js");
function resolve(template, character) {
    // Start with a copy of raw editable values — this grows as we resolve fields
    const resolved = { ...character.values };
    // ── Pass 1: derived fields ───────────────────────────────────────────────
    // These only reference editable fields, which are already in resolved
    for (const section of template.sections) {
        for (const field of section.fields) {
            if (field.type !== "derived")
                continue;
            if (!field.formula) {
                resolved[`${section.name}_${field.name}`] = "#ERR: derived field has no formula";
                continue;
            }
            const path = `${section.name}_${field.name}`;
            resolved[path] = (0, evaluator_js_1.evaluate)(field.formula, resolved);
        }
    }
    // ── Pass 2: check fields ─────────────────────────────────────────────────
    // These can reference editable fields AND derived fields resolved in pass 1
    for (const section of template.sections) {
        for (const field of section.fields) {
            if (field.type !== "check")
                continue;
            if (!field.formula) {
                resolved[`${section.name}_${field.name}`] = "#ERR: check field has no formula";
                continue;
            }
            const path = `${section.name}_${field.name}`;
            resolved[path] = (0, evaluator_js_1.evaluate)(field.formula, resolved);
        }
    }
    return {
        ...character,
        resolved
    };
}
