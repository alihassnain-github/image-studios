"use client";

import React, { memo, useRef } from "react";
import { PexelsVideo } from "@/types/video";

type Photographer = {
    name: string;
    url?: string;
    id?: number;
    avatarUrl?: string;
};

export interface VideoCardProps {
    video: PexelsVideo;
    photographer?: Photographer | null;
    downloadUrl?: string;
}

const VideoCard = memo(function VideoCard({ video, photographer, downloadUrl }: VideoCardProps) {

    const videoRef = useRef<HTMLVideoElement>(null);

    // Get the best quality video file (prefer HD, fallback to SD)
    const getBestVideoFile = () => {
        const sdFile = video.video_files.find(file => file.quality === "sd");
        const hdFile = video.video_files.find(file => file.quality === "hd");
        return sdFile || hdFile || video.video_files[0];
    };

    const bestVideoFile = getBestVideoFile();

    const handleMouseEnter = () => {
        if (videoRef.current) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Automatic playback started!
                    // Show playing UI.
                }).catch(error => {
                    // Auto-play was prevented
                    // Show paused UI.
                });
            }
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    return (
        <figure
            className="group relative break-inside-avoid mb-4 overflow-hidden rounded-lg shadow-sm bg-base-100"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="relative w-full skeleton"
                style={{
                    aspectRatio: `${video.width} / ${video.height}`,
                }}
            >
                {/* Video element */}
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={video.image}
                >
                    {bestVideoFile && (
                        <source src={bestVideoFile.link} type={bestVideoFile.file_type} />
                    )}
                </video>

                {/* Hover overlay */}
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {/* subtle backdrop */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/0 to-black/30" />

                    {/* top actions */}
                    <div className="relative z-10 flex items-start justify-end p-2 md:p-4">
                        {downloadUrl && (
                            <a
                                href={`/api/download?url=${encodeURIComponent(downloadUrl)}`}
                                className="pointer-events-auto btn btn-sm btn-neutral/90 hover:btn-neutral gap-2"
                                aria-label="Download video"
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

export default VideoCard;