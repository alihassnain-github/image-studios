"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import { Clapperboard, Image, Search } from "lucide-react";
import InputSuggestions from "./input-suggestions";
import debounce from "lodash.debounce";
import { saveSearchHistory, clearSearchHistory, getSearchHistory } from "@/utils/history";
import cachedFetch from "@/utils/fetch-cache";
import { twMerge } from "tailwind-merge";

export default function SearchBar({ className }: { className?: string }) {

    const router = useRouter()

    const searchBarRef = useRef<HTMLFormElement>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>(getSearchHistory());
    const [suggestions, setSuggestions] = useState<{ word: string, score: number }[]>([]);
    const [searchQuery, setSearchQuery] = useState<{ value: string, type: "photos" | "videos" }>({
        value: "",
        type: "photos",
    });

    function clearHistory() {
        clearSearchHistory();
        setSearchHistory([]);
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const query = searchQuery.value.trim();
        if (!query) return;

        onSelect(query);

        // Navigate to search results page
        const path = searchQuery.type === "videos"
            ? `/search/videos/${encodeURIComponent(query)}`
            : `/search/${encodeURIComponent(query)}`;

        router.push(path);
    };

    const fetchSuggestions = async (query: string) => {
        try {
            const data = await cachedFetch(`${process.env.NEXT_PUBLIC_DATAMUSE_API_URI}/sug?s=${query}`);
            setSuggestions(data.slice(0, 6));
        } catch (error) {
            console.error("Error fetching keyword: ", error);
        }
    }

    const debouncedFetchSuggestions = useCallback(
        debounce(fetchSuggestions, 500), []
    );

    const onSelect = (query: string) => {
        saveSearchHistory(query);
        setSearchHistory(getSearchHistory());
        setIsOpen(false);
    }

    useEffect(() => {
        const query = searchQuery.value.trim();
        if (query) {
            debouncedFetchSuggestions(query);
        } else {
            setSuggestions([]);
        }

        return () => {
            debouncedFetchSuggestions.cancel();
        };
    }, [searchQuery, debouncedFetchSuggestions]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchBarRef]);

    return (
        <form ref={searchBarRef} onSubmit={handleSearch} className={twMerge("w-full max-w-2xl mx-auto mb-8 relative", className)}>
            <div className="flex items-center gap-2 bg-base-200 rounded-xl px-2 py-2 shadow-sm">
                <div className="dropdown dropdown-hover">
                    <div tabIndex={0} role="button" className="btn bg-[none] border-none rounded-lg px-3">
                        {searchQuery.type === "photos" ? (
                            <>
                                <Image className="w-5 h-5 text-gray-400" />
                                <span className="hidden sm:inline">Photos</span>
                            </>
                        ) : (
                            <>
                                <Clapperboard className="w-5 h-5 text-gray-400" />
                                <span className="hidden sm:inline">Videos</span>
                            </>
                        )}
                    </div>
                    <ul className="dropdown-content menu bg-base-100 text-black rounded-box z-30 w-32 p-2 shadow-sm">
                        <li>
                            <a onClick={() => setSearchQuery({ ...searchQuery, type: "photos" })} className="font-medium">
                                <Image className="w-5 h-5 text-gray-400" />
                                Photos
                            </a>
                        </li>
                        <li>
                            <a onClick={() => setSearchQuery({ ...searchQuery, type: "videos" })} className="font-medium">
                                <Clapperboard className="w-5 h-5 text-gray-400" />
                                Videos
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="join w-full">
                    <input
                        type="text"
                        placeholder={`Search free stock ${searchQuery.type}...`}
                        className="input input-ghost border-none bg-base-100 focus:outline-none focus:ring-0 join-item flex-1 text-black placeholder:text-gray-500"
                        value={searchQuery.value}
                        onChange={(e) => setSearchQuery({ ...searchQuery, value: e.target.value })}
                        onFocus={() => setIsOpen(true)}
                    />
                    <button type="submit" className="btn btn-primary join-item">
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* history & suggestion Component */}
            {isOpen && (searchHistory.length > 0 || suggestions.length > 0) && (
                <InputSuggestions
                    suggestions={suggestions}
                    searchHistory={searchHistory}
                    type={searchQuery.type}
                    onSelect={onSelect}
                    clearHistory={clearHistory}
                />
            )}

        </form>
    )
}