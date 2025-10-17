const CACHE_TTL = 1000 * 60 * 10; // 10 minutes
const memoryCache = new Map<string, { data: any; timestamp: number }>();

export default async function cachedFetch(url: string) {
    const now = Date.now();
    const cached = memoryCache.get(url);

    if (cached && now - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        memoryCache.set(url, { data, timestamp: now });

        // Optional: persist to localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem(url, JSON.stringify({ data, timestamp: now }));
        }

        return data;
    } catch (error) {
        console.error("Fetch error:", error);

        // fallback to localStorage if available
        if (typeof window !== "undefined") {
            const persisted = localStorage.getItem(url);
            if (persisted) {
                const { data } = JSON.parse(persisted);
                return data;
            }
        }

        throw error;
    }
}
