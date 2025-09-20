"use client";

import React, { useEffect, useRef, useState } from "react";
import ImageCard from "@/components/image-card";
import { PexelsPhoto, PexelsSearchResponse } from "@/types/image";
import FilterBar from "./filter-bar";
import { formatNumber } from "@/utils/format";
import { usePathname, useSearchParams } from "next/navigation";
import { getData } from "@/utils/api-helpers";
import SearchSkeleton from "./skeletons/search-skeleton";
import useThrottle from "@/hooks/useThrottle";

export interface MasonryGridProps {
    initialData: PexelsSearchResponse;
    contentType?: "image" | "video";
}

export default function MasonryGrid({ initialData, contentType }: MasonryGridProps) {

    const [data, setData] = useState<PexelsSearchResponse>(initialData);
    const [loading, setLoading] = useState({
        initialLoading: false,
        onScrollLoading: false,
    });

    const isInitialMount = useRef(true);
    const observerRef = useRef<HTMLDivElement | null>(null);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {

        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const orientation = searchParams.get('orientation');
        const color = searchParams.get('color');
        const size = searchParams.get('size');

        const params: Record<string, string> = {
            query: pathname.split("/").pop()!,
        };
        if (orientation) params.orientation = orientation;
        if (size) params.size = size;
        if (color) params.color = color;

        const queryString = new URLSearchParams(params).toString();

        const fetchData = async () => {
            try {
                setLoading((prev) => ({ ...prev, initialLoading: true }));
                const data = await getData(`${process.env.NEXT_PUBLIC_PEXELS_API_URI}/search?${queryString}`, "MasonryGrid", { headers: { Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY } });
                setData(data);
            } catch (error) {
                console.error(error);
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
            const nextData = await getData(data.next_page, "MasonryGridScroll", {
                headers: { Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY },
            });

            // Append photos but keep other info updated
            setData((prev) => ({
                ...nextData,
                photos: [...prev.photos, ...nextData.photos],
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading((prev) => ({ ...prev, onScrollLoading: false }));
        }
    };

    const throttledFetch = useThrottle(fetchNextPage, 2000);

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
                    Photos <div className="badge badge-sm badge-primary">{formatNumber(data.total_results)}</div>
                </button>

            </div>

            {loading.initialLoading ? (
                <SearchSkeleton />
            ) : (
                <div
                    className="columns-2 lg:columns-3 gap-4"
                >
                    {contentType === "image" && data.photos.map((img: PexelsPhoto) => (
                        <ImageCard
                            key={img.id}
                            src={img.src.large2x || img.src.large || img.src.medium}
                            alt={img.alt || "Image"}
                            width={img.width}
                            height={img.height}
                            avgColor={img.avg_color}
                            photographer={{ name: img.photographer, url: img.photographer_url, id: img.photographer_id }}
                            downloadUrl={img.src.original}
                        />
                    ))}
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

        </>
    );
}


