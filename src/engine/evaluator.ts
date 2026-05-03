import { create, all } from "mathjs"
import type { MathJsInstance } from "mathjs"
import type { RawValues } from "./types.js"

const math: MathJsInstance = create(all!)

export function evaluate(formula: string, values: RawValues): number | string {
  try {
    // Build the scope — keys are already underscore-separated, pass them straight in
    const scope: Record<string, number | string> = {}
    for (const [key, value] of Object.entries(values)) {
      scope[key] = value
    }

    const result = math.evaluate(formula, scope)

    // Coerce mathjs internal types to plain number or string
    if (typeof result === "number") return result
    if (typeof result === "string") return result
    if (typeof result?.toNumber === "function") return result.toNumber()

    // Fallback — something came back but we don't know what it is
    return `#ERR: unexpected result type`

  } catch (error) {
    if (error instanceof Error) {
      return `#ERR: ${error.message}`
    }
    return `#ERR: unknown error`
  }
}