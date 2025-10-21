"use client";

import { PexelsPhoto } from "@/types/image";
import { ArrowBigDownDash, CircleCheck, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ShareModal from "./share-modal";
import { useTopLoader } from "nextjs-toploader";
import { useRouter } from "next/navigation";

interface ImageModalProps {
    data: PexelsPhoto;
}

export default function ImageModal({ data }: ImageModalProps) {

    const loader = useTopLoader();

    const router = useRouter();

    const modalRef = useRef<HTMLDialogElement | null>(null);
    const imageContainerRef = useRef<HTMLDivElement | null>(null);

    const [isZoomed, setIsZoomed] = useState(false);
    const [transformOrigin, setTransformOrigin] = useState('center center');

    useEffect(() => {
        if (modalRef.current) {
            modalRef.current.showModal();
        }
    }, [modalRef]);

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

    const handleClose = () => {
        router.back();
    };

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed || !imageContainerRef.current) return;

        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setTransformOrigin(`${x}% ${y}%`);
    };

    return (
        <dialog ref={modalRef} id="image_modal" className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <form method="dialog" onClick={handleClose}>
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold lg:text-lg text-sm flex items-center gap-2">
                    <a target="_blank" href={data.photographer_url} className="link">{data.photographer}</a>
                    <ExternalLink className="w-4 w-4" />
                </h3>

                <div className="relative my-4">
                    {/* Image container with aspect ratio */}
                    <div
                        ref={imageContainerRef}
                        className={`relative w-full rounded-xl overflow-hidden transition-all duration-300 ease-in-out ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                            }`}
                        style={{
                            aspectRatio: `${data.width} / ${data.height}`,
                            backgroundColor: data.avg_color,
                            maxHeight: '70vh'
                        }}
                        onClick={toggleZoom}
                        onMouseMove={handleMouseMove}
                    >
                        <Image
                            src={data.src.large2x}
                            alt={data.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                            className={`object-contain transition-transform duration-300 ease-in-out ${isZoomed ? 'scale-150' : 'scale-100'}`}
                            style={{
                                transformOrigin: transformOrigin
                            }}
                            priority
                        />
                    </div>

                    {/* Download dropdown */}
                    <div className="dropdown dropdown-end absolute top-2 right-2 z-10">
                        <div tabIndex={0} role="button" className="btn btn-soft btn-primary rounded-xl">
                            <ArrowBigDownDash className="w-4 h-4" />
                            <span className="hidden sm:inline">Download</span>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg mt-1">
                            <li>
                                <button
                                    onClick={() => handleDownload(data.src.original)}
                                    className="font-medium"
                                    aria-label="Download image"
                                >
                                    Original
                                    <span className="text-xs opacity-60">
                                        {data.width} × {data.height}
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleDownload(data.src.large)}
                                    className="font-medium"
                                    aria-label="Download image"
                                >
                                    Large
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleDownload(data.src.medium)}
                                    className="font-medium"
                                    aria-label="Download image"
                                >
                                    Medium
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleDownload(data.src.small)}
                                    className="font-medium"
                                    aria-label="Download image"
                                >
                                    Small
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <CircleCheck className="w-4 h-4" />
                        <a target="_blank" href="https://www.pexels.com/license/" className="link link-hover">Free to use</a>
                    </div>
                    <ShareModal type="photo" photographer={data.photographer} />
                </div>
            </div>
            <form method="dialog" className="modal-backdrop" onClick={handleClose}>
                <button>close</button>
            </form>
        </dialog>
    )
}   