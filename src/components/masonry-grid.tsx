import React from "react";
import ImageCard from "@/components/image-card";
import { PexelsPhoto } from "@/types/image";

export interface MasonryGridProps {
    images: PexelsPhoto[];
}

export default function MasonryGrid({ images }: MasonryGridProps) {
    return (
        <div
            className="columns-2 lg:columns-3 gap-4"
        >
            {images?.map((img) => (
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


