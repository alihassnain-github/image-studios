"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { memo } from "react";

type Photographer = {
  name: string;
  url?: string;
  id?: number;
  avatarUrl?: string;
};

export interface ImageCardProps {
  id: number,
  src: string;
  alt: string;
  photographer?: Photographer | null;
  width: number;
  height: number;
  avgColor?: string;
  downloadUrl?: string;
}

const ImageCard = memo(function ImageCard({ id, src, alt, photographer, width, height, downloadUrl, avgColor }: ImageCardProps) {

  const router = useRouter();

  return (
    <figure onClick={() => router.push(`/photo/${id}`)} className="cursor-pointer group relative break-inside-avoid mb-4 overflow-hidden rounded-lg shadow-sm bg-base-100">
      <div
        className="relative w-full"
        style={{
          aspectRatio: `${width} / ${height}`,
          backgroundColor: avgColor,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          priority={false}
        />

        {/* Hover overlay */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {/* subtle backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/0 to-black/30" />

          {/* top actions */}
          <div className="relative z-10 flex items-start justify-end p-2 md:p-4">
            {downloadUrl && (
              <a
                href={`/api/download?url=${encodeURIComponent(downloadUrl)}`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="pointer-events-auto btn btn-sm btn-neutral/90 hover:btn-neutral gap-2"
                aria-label="Download image"
              >
                {/* icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M12 16a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L11 12.586V3a1 1 0 1 1 2 0v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 12 16Z" />
                  <path d="M5 20a2 2 0 0 1-2-2v-1a1 1 0 1 1 2 0v1h14v-1a1 1 0 1 1 2 0v1a2 2 0 0 1-2 2H5Z" />
                </svg>
                <span className="hidden lg:inline">Download</span>
              </a>
            )}
          </div>

          {/* bottom photographer info */}
          {photographer?.name && (
            <div className="relative z-10 flex items-center gap-2 p-2 md:p-4">
              <a
                href={photographer.url}
                target="_blank"
                rel="noreferrer"
                className="pointer-events-auto flex items-center gap-2 border-b-1 border-white"
              >
                <span className="text-xs font-bold md:text-sm text-white drop-shadow-sm">
                  {photographer.name}
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </figure>
  );
})

export default ImageCard;
