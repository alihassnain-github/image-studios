import { ArrowUpRight, BrushCleaning, Search } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface InputSuggestionsProps {
    suggestions: { word: string, score: number }[];
    searchHistory: string[];
    clearHistory: () => void;
    onSelect: (query: string) => void;
    type: "photos" | "videos";
    className?: string;
}

export default function InputSuggestions({ suggestions, searchHistory, clearHistory, onSelect, type, className }: InputSuggestionsProps) {

    const makeLink = (word: string) => {
        return type === "videos"
            ? `/search/videos/${encodeURIComponent(word)}`
            : `/search/${encodeURIComponent(word)}`;
    };

    return (
        <div
            id="search-popover"
            className={twMerge("bg-base-100 rounded-xl px-3 py-4 absolute z-20 shadow-xl w-full end-0 mt-2 text-black ring-1 ring-base-200/60", className)}
        >
            {suggestions.length > 0 && (
                <div>
                    <ul className="menu menu-md rounded-box w-full bg-inherit p-0">
                        {suggestions.map((item, index) => (
                            <li key={index}>
                                <Link href={makeLink(item.word)} prefetch={false} onClick={() => onSelect(item.word)} className="font-medium flex items-center gap-2 hover:bg-base-200/70 rounded-lg transition-colors">
                                    <Search className="w-4 h-4 text-gray-400" />
                                    {item.word}
                                    <ArrowUpRight className="w-4 h-4 ms-auto text-gray-300" />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="divider mt-3 mb-0"></div>
                </div>
            )}

            {/* history */}
            {searchHistory.length > 0 && (
                <>
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold">Recent Searches</h3>
                        <button onClick={clearHistory} className="tooltip" data-tip="Clear" aria-label="Clear recent searches">
                            <BrushCleaning className="w-4 h-4 rotate-45" />
                        </button>
                    </div>
                    <div className="divider mt-0 mb-3"></div>
                    <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                        {searchHistory.map((item, index) => (
                            <Link
                                key={index}
                                href={`/search/${encodeURIComponent(item)}`}
                                prefetch={false}
                                className="btn btn-sm bg-base-200/40 hover:bg-base-200 rounded-lg font-medium justify-between"
                            >
                                <span>{item}</span>
                                <Search className="w-4 h-4 text-gray-400" />
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}