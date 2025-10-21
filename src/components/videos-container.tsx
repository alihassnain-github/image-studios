"use client";

import React, { useEffect, useRef, useState } from "react";
import VideoCard from "@/components/video-card";
import { PexelsVideo, PexelsVideoSearchResponse } from "@/types/video";
import FilterBar from "./filter-bar";
import { formatNumber } from "@/utils/format";
import { usePathname, useSearchParams } from "next/navigation";
import { getData } from "@/utils/api-helpers";
import SearchSkeleton from "./skeletons/search-skeleton";
import { RotateCcw, SearchX } from "lucide-react";
import { VirtuosoMasonry } from "@virtuoso.dev/masonry";
import { toast } from "react-toastify";
import throttle from "lodash.throttle";
import { useRouter } from "nextjs-toploader/app";

export interface VideosContainerProps {
    initialData: PexelsVideoSearchResponse;
}

export default function VideosContainer({ initialData }: VideosContainerProps) {

    const [data, setData] = useState<PexelsVideoSearchResponse>(initialData);
    const [loading, setLoading] = useState({
        initialLoading: false,
        onScrollLoading: false,
    });
    const [error, setError] = useState<Record<string, string | null>>({
        initialError: null,
        onScrollError: null,
    });

    const isInitialMount = useRef(true);
    const observerRef = useRef<HTMLDivElement | null>(null);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {

        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const orientation = searchParams.get('orientation');
        const size = searchParams.get('size');

        const params: Record<string, string> = {
            query: pathname.split("/").pop()!,
        };
        if (orientation) params.orientation = orientation;
        if (size) params.size = size;

        const queryString = new URLSearchParams(params).toString();

        const fetchData = async () => {
            try {
                setLoading((prev) => ({ ...prev, initialLoading: true }));
                setError((prev) => ({ ...prev, initialError: null }));
                const data = await getData(`${process.env.NEXT_PUBLIC_PEXELS_API_URI}/videos/search?${queryString}`, "VideosContainer", { headers: { Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY } });
                setData(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load videos. Please try again.");
                setError((prev) => ({ ...prev, initialError: "Failed to load videos. Please try again." }));
            } finally {
                setLoading((prev) => ({ ...prev, initialLoading: false }));
            }
        }

        fetchData();

    }, [searchParams])

    const fetchNextPage = async () => {
        if (!data.next_page) return; // No more results
        try {
            setLoading((prev) => ({ ...prev, onScrollLoading: true }));
            setError((prev) => ({ ...prev, onScrollError: null }));
            const nextData = await getData(data.next_page, "VideosContainerScroll", {
                headers: { Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY },
            });

            // Append videos but keep other info updated
            setData((prev) => ({
                ...nextData,
                videos: [...prev.videos, ...nextData.videos],
            }));
        } catch (error) {
            console.error(error);
            toast.error("Failed to load more videos. Please try again.");
            setError((prev) => ({ ...prev, onScrollError: "Failed to load more videos. Please try again." }));
        } finally {
            setLoading((prev) => ({ ...prev, onScrollLoading: false }));
        }
    };

    const throttledFetch = throttle(fetchNextPage, 2000);

    useEffect(() => {
        const sentinel = observerRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !loading.onScrollLoading) {
                    throttledFetch();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinel);

        return () => {
            if (sentinel) observer.unobserve(sentinel);
        };
    }, [throttledFetch, loading.onScrollLoading]);

    return (
        <>
            {/* Stat Bar and Filter Button */}
            <div className="flex items-center justify-between gap-4 mb-6">

                {/* Filter Bar */}
                <FilterBar />

                <button className="btn">
                    Videos <div className="badge badge-sm badge-primary">{formatNumber(data.total_results)}</div>
                </button>

            </div>

            {loading.initialLoading ? (
                <SearchSkeleton />
            ) : (
                <VirtuosoMasonry
                    data={data.videos}
                    ItemContent={({ data: video }: { data: PexelsVideo }) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            photographer={{ name: video.user.name, url: video.user.url, id: video.user.id }}
                            downloadUrl={video.video_files.find(file => file.quality === "hd")?.link || video.video_files[0]?.link}
                        />
                    )}
                    columnCount={window.innerWidth < 1024 ? 2 : 3}
                    style={{ overflowY: "auto" }}
                    className="gap-4 scrollbar-hide"
                />
            )}

            {!loading.initialLoading && data.videos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="bg-gray-100 rounded-full flex items-center justify-center w-24 h-24">
                        <SearchX className="text-gray-500 w-12 h-12" />
                    </div>
                    <div className="my-8 text-center">
                        <h4 className="font-bold">No matching search results</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                            Try again using more general search terms
                        </p>
                    </div>
                    <button className="btn btn-primary" onClick={() => { router.replace(pathname) }}>
                        <RotateCcw className="w-4 h-4" />
                        Clear All Filters
                    </button>
                </div>
            )}

            {/* Loader trigger */}
            <div ref={observerRef} className="h-10" />

            {loading.onScrollLoading && (
                <div className="flex items-center justify-center space-x-3">
                    <span className="loading loading-ring loading-xl"></span>
                    <span className="loading loading-ring loading-xl"></span>
                    <span className="loading loading-ring loading-xl"></span>
                    <span className="loading loading-ring loading-xl"></span>
                    <span className="loading loading-ring loading-xl"></span>
                </div>
            )}

            {error.onScrollError && (
                <div className="flex items-center justify-center py-4">
                    <button className="btn btn-outline" onClick={fetchNextPage}>Load More</button>
                </div>
            )}

        </>
    );
}