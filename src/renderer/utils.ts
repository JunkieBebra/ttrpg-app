export function formatFieldName(name: string): string {
    return name
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    }

// "attributes" → "Attributes"
export function formatSectionName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1)
    }

// Consistent #ERR detection
export function isError(value: string | number | null | undefined): boolean {
    return typeof value === "string" && value.startsWith("#ERR")
    }

export function formatFilename(filename: string): string {
    return filename.replace(".json", "").split("_").map(
        word => word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ")
    }