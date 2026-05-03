"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = evaluate;
const mathjs_1 = require("mathjs");
const math = (0, mathjs_1.create)(mathjs_1.all);
function evaluate(formula, values) {
    try {
        // Build the scope — keys are already underscore-separated, pass them straight in
        const scope = {};
        for (const [key, value] of Object.entries(values)) {
            scope[key] = value;
        }
        const result = math.evaluate(formula, scope);
        // Coerce mathjs internal types to plain number or string
        if (typeof result === "number")
            return result;
        if (typeof result === "string")
            return result;
        if (typeof result?.toNumber === "function")
            return result.toNumber();
        // Fallback — something came back but we don't know what it is
        return `#ERR: unexpected result type`;
    }
    catch (error) {
        if (error instanceof Error) {
            return `#ERR: ${error.message}`;
        }
        return `#ERR: unknown error`;
    }
}
