'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation'
import { Search } from "lucide-react";

export default function SearchBar() {

    const router = useRouter()

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-8">
            <div className="join w-full">
                <input
                    type="text"
                    placeholder="Search free stock photos & videos..."
                    className="input input-bordered join-item flex-1 text-black placeholder:text-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-primary join-item md:px-8 px-4">
                    <Search className="w-5 h-5" />
                    <span className="font-light md:block hidden">Search</span>
                </button>
            </div>
        </form>
    )
}