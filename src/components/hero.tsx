'use client';

import { useState } from "react";

export default function Hero() {

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // TODO: Implement search functionality
            console.log('Searching for:', searchQuery);
        }
    };

    const categoryChips = [
        { name: 'Nature', icon: '🌿' },
        { name: 'Technology', icon: '💻' },
        { name: 'Travel', icon: '✈️' },
        { name: 'Food', icon: '🍕' },
        { name: 'Business', icon: '💼' },
        { name: 'Art', icon: '🎨' },
    ];

    return (
        <main className="flex-1 hero min-h-screen" style={{
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content z-10">
                <div className="max-w-4xl">
                    <h1 className="mb-8 text-5xl md:text-6xl font-bold">
                        Discover Amazing Images
                    </h1>
                    <p className="mb-8 text-xl md:text-2xl">
                        Search millions of free stock photos and videos
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-8">
                        <div className="join w-full">
                            <input
                                type="text"
                                placeholder="Search free stock photos & videos..."
                                className="input input-bordered join-item flex-1 text-black placeholder:text-gray-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary join-item px-8">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Category Chips */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {categoryChips.map((category) => (
                            <button
                                key={category.name}
                                className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-primary"
                                onClick={() => setSearchQuery(category.name)}
                            >
                                <span className="mr-2">{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="stats shadow mt-12 bg-base-100 bg-opacity-90 text-black">
                        <div className="stat">
                            <div className="stat-title">Total Images</div>
                            <div className="stat-value text-primary">2M+</div>
                            <div className="stat-desc">High quality photos</div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Videos</div>
                            <div className="stat-value text-secondary">500K+</div>
                            <div className="stat-desc">4K quality videos</div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Downloads</div>
                            <div className="stat-value text-accent">10M+</div>
                            <div className="stat-desc">Free downloads</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}