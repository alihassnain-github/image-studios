"use client";

import { RiFacebookLine, RiLinkedinLine, RiPinterestLine, RiTwitterXFill } from "@remixicon/react";
import { Share2, Clipboard, ClipboardCheck } from "lucide-react";
import { useRef, useState } from "react";

interface ShareModalProps {
    type: "photo" | "video";
    photographer: string;
}

export default function ShareModal({ type, photographer }: ShareModalProps) {

    const modalRef = useRef<HTMLDialogElement | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const currentUrl = window.location.href;
    const shareText = `${type.charAt(0).toUpperCase() + type.slice(1)} by ${photographer} on Image Studios`;

    const handleClick = () => {
        if (modalRef.current) {
            modalRef.current.showModal();
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(currentUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }

    const socialShareLinks = {
        x: `https://x.com/intent/tweet?url=${currentUrl}&text=${shareText}`,
        pinterest: `https://www.pinterest.com/pin/create/link?url=${currentUrl}`,
        linkedin: `https://www.linkedin.com/shareArticle?url=${currentUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&t=${shareText}`,
    };

    return (
        <>
            <button onClick={handleClick} className="btn btn-soft btn-primary rounded-full">
                <Share2 className="w-4 h-4" />
                Share
            </button>
            <dialog ref={modalRef} className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <h3 className="font-bold text-lg">Share this {type.charAt(0).toUpperCase() + type.slice(1)}</h3>

                    <div className="flex items-center gap-4 my-5 justify-center">
                        <a href={socialShareLinks.x} target="_blank" className="btn btn-circle btn-ghost" title="X">
                            <RiTwitterXFill size={18} />
                        </a>
                        <a href={socialShareLinks.pinterest} target="_blank" className="btn btn-circle btn-ghost" title="Pinterest">
                            <RiPinterestLine size={18} />
                        </a>
                        <a href={socialShareLinks.linkedin} target="_blank" className="btn btn-circle btn-ghost" title="LinkedIn">
                            <RiLinkedinLine size={18} />
                        </a>
                        <a href={socialShareLinks.facebook} target="_blank" className="btn btn-circle btn-ghost" title="Facebook">
                            <RiFacebookLine size={18} />
                        </a>
                    </div>

                    <p className="mb-1 text-sm text-gray-250">Copy and share the link below</p>
                    <div className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl flex justify-between items-center gap-4 cursor-pointer" onClick={handleCopy}>
                        <p>{type.charAt(0).toUpperCase() + type.slice(1)} by {photographer}</p>
                        <button className="btn btn-soft btn-primary btn-circle" onClick={handleCopy}>
                            {isCopied ? <ClipboardCheck className="w-5 h-5" /> : <Clipboard className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    )
}