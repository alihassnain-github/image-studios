"use client";

import { PexelsVideo } from "@/types/video";
import { formatVideoFiles } from "@/utils/format";
import { ArrowBigDownDash, CircleCheck, ExternalLink } from "lucide-react";
import { useTopLoader } from "nextjs-toploader";
import ShareModal from "./share-modal";

interface VideoViewProps {
    data: PexelsVideo;
}

export default function VideoView({ data }: VideoViewProps) {

    const loader = useTopLoader();

    const handleDownload = (downloadUrl: string) => {

        loader.start();

        const a = document.createElement('a');
        a.href = `/api/download?url=${encodeURIComponent(downloadUrl)}`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        loader.done(true);
    };

    // Prefer HD, fallback to SD
    const getBestVideoFile = () => {
        const hdFile = data.video_files.find(file => file.quality === "hd");
        const sdFile = data.video_files.find(file => file.quality === "sd");
        return hdFile || sdFile || data.video_files[0];
    };

    const bestVideoFile = getBestVideoFile();

    return (
        <main className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6">
            <h3 className="font-bold lg:text-lg text-sm flex items-center gap-2">
                <a target="_blank" href={data.user.url} className="link">{data.user?.name}</a>
                <ExternalLink className="w-4 w-4" />
            </h3>

            <div className="relative my-4">
                {/* Video container with aspect ratio */}
                <div
                    className="relative w-full rounded-xl overflow-hidden"
                    style={{
                        aspectRatio: `${data.width} / ${data.height}`,
                        maxHeight: '70vh'
                    }}
                >

                    {/* Video element */}
                    <video
                        className="w-full h-full object-cover"
                        muted
                        autoPlay
                        controls
                        playsInline
                        preload="metadata"
                        poster={data.image}
                    >
                        {bestVideoFile && (
                            <source src={bestVideoFile.link} type={bestVideoFile.file_type} />
                        )}
                    </video>

                </div>

                {/* Download dropdown */}
                <div className="dropdown dropdown-end absolute top-2 right-2 z-10">
                    <div tabIndex={0} role="button" className="btn btn-soft btn-primary rounded-xl">
                        <ArrowBigDownDash className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg mt-1">
                        {formatVideoFiles(data.video_files).map((file) => (
                            <li key={file.id}>
                                <button
                                    onClick={() => handleDownload(file.link)}
                                    className="font-medium"
                                    aria-label="Download Video"
                                >
                                    {file.label}
                                    <span className="text-xs opacity-60">
                                        {file.resolution}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <CircleCheck className="w-4 h-4" />
                    <a target="_blank" href="https://www.pexels.com/license/" className="link link-hover">Free to use</a>
                </div>
                <ShareModal type="video" photographer={data.user.name} />
            </div>
        </main>
    )
}   