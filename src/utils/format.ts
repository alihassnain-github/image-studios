export function toTitleCase(str: string) {
    return str
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

export function normalizeParam(value: string | string[] | undefined): string {
    if (Array.isArray(value)) return value[0]; // take first one
    return value ?? ""; // fallback to empty string
}

export function formatNumber(num: number): string {
    const units = [
        { value: 1_000_000_000, suffix: 'B' },
        { value: 1_000_000, suffix: 'M' },
        { value: 1_000, suffix: 'K' },
    ];

    for (const unit of units) {
        if (num >= unit.value) {
            return (num / unit.value).toFixed(1).replace(/\.0$/, '') + unit.suffix;
        }
    }

    return num.toString();
}

export function saveSearchHistory(query: string) {
    const key = "search_history";
    const stored = JSON.parse(localStorage.getItem(key) || "[]");

    // Remove duplicates
    const filtered = stored.filter((item: string) => item !== query);

    // Add new query at start
    filtered.unshift(query);

    // Limit to 10
    const limited = filtered.slice(0, 10);

    localStorage.setItem(key, JSON.stringify(limited));
}

export function getSearchHistory(): string[] {
    return JSON.parse(localStorage.getItem("search_history") || "[]");
}

export function clearSearchHistory() {
    localStorage.removeItem("search_history");
}