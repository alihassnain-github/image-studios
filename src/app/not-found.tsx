import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page Not Found - Image Studios",
    description: "The page you're looking for doesn't exist. Return to Image Studios to discover amazing free stock photos and videos.",
};

export default function NotFound() {
    return (
        <main className="flex-1 hero min-h-screen" style={{
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content z-10">
                <div className="max-w-2xl">
                    {/* 404 Number */}
                    <div className="mb-8">
                        <h1 className="text-9xl md:text-[12rem] font-bold opacity-20 mb-4">
                            404
                        </h1>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Oops! Page Not Found
                        </h2>
                        <p className="text-base md:text-lg mb-8 opacity-70 text-center">
                            The page you are looking for was moved, removed, renamed or might never existed.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <Link href="/">
                            <button className="btn btn-primary btn-soft">
                                Discover free photos or videos
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
