"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation'
import { Clapperboard, Image, Search } from "lucide-react";
import { saveSearchHistory } from "@/utils/format";
import InputSuggestions from "./input-suggestions";

export default function SearchBar() {

    const router = useRouter()

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState({
        value: "",
        type: "photos",
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const query = searchQuery.value.trim();
        if (!query) return;

        saveSearchHistory(query);

        // Navigate to search results page
        const path = searchQuery.type === "videos"
            ? `/search/videos/${encodeURIComponent(query)}`
            : `/search/${encodeURIComponent(query)}`;

        router.push(path);
    };


    return (
        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-8 relative">
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
                                Videos
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
                        autoFocus
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
            {isOpen && (
                <InputSuggestions />
            )}

        </form>
    )
}