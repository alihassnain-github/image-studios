import { ChevronDown, CircleCheck, ExternalLink, Share2, X } from "lucide-react";
import Image from "next/image";

export default function ImageModal() {
    return (
        <div className="p-12">
            <dialog id="photo_modal" className="modal modal-open overflow-y-auto py-12">
                <div className="modal-box p-0 w-11/12 sm:w-5/6 lg:w-[1000px] max-w-none flex flex-col max-h-[90vh] overflow-hidden">

                    {/* Header */}
                    <div className="px-4 sm:px-6 pt-6 pb-4 flex flex-wrap items-center justify-between gap-3 border-b border-base-300">
                        <h3 className="font-bold text-base sm:text-lg flex gap-2 items-center">
                            <a href="" className="link">Mohamed elamine  M'siouri</a>
                            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                        </h3>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-primary btn-soft">Free Download <ChevronDown className="w-4 h-4" /></div>
                            <ul className="dropdown-content menu bg-base-100 rounded-box z-10 w-56 p-2 shadow">
                                <li><a>Original 640 x 424</a></li>
                                <li><a>Large 1920 x 1280</a></li>
                                <li><a>Medium 1280 x 854</a></li>
                                <li><a>Small 640 x 427</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Image area: grows, scrolls if needed, image centered */}
                    <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-full">
                                <Image
                                    src={"/mountain-photo.jpg"}
                                    alt={"Image"}
                                    width={2400}
                                    height={1600}
                                    className="w-full h-auto object-contain"
                                    priority={false}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4 border-t border-base-300">
                        <a href="https://www.pexels.com/license/" className="flex gap-2 items-center" target="_blank">
                            <CircleCheck className="w-4 h-4" />
                            <span className="text-sm">Free to use</span>
                        </a>
                        <button className="btn btn-soft btn-info">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    )
}