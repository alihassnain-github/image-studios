const HISTORY_KEY = "searchHistory";

export function getSearchHistory(): string[] {
    if (typeof window === "undefined") return [];
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

export function saveSearchHistory(query: string) {
    if (typeof window === "undefined") return;
    const history = getSearchHistory();
    const updated = [query, ...history.filter((item) => item !== query)].slice(0, 10);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function clearSearchHistory() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(HISTORY_KEY);
}
