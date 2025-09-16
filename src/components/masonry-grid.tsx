import React from "react";
import ImageCard from "@/components/image-card";
import { PexelsPhoto } from "@/types/image";
import { getData } from "@/utils/api-helpers";

export interface MasonryGridProps {
    dataFetchingQuery: string;
    type?: "image" | "video";
}

export default async function MasonryGrid({ dataFetchingQuery, type }: MasonryGridProps) {

    const data = await getData(`${process.env.PEXELS_API_URI}/search?${dataFetchingQuery}`, "SearchPage", { next: { revalidate: 60 }, headers: { Authorization: process.env.PEXELS_API_KEY } });

    console.log(data);

    return (
        <div
            className="columns-2 lg:columns-3 gap-4"
        >
            {type === "image" && data.photos.map((img: PexelsPhoto) => (
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
    );
}


