import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) {
        return new Response("Missing URL", { status: 400 });
    }

    const response = await fetch(url);
    const blob = await response.blob();

    // Extract filename from URL (default fallback "image")
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const originalName = pathname.substring(pathname.lastIndexOf("/") + 1) || "file";

    return new Response(blob, {
        headers: {
            "Content-Type": response.headers.get("content-type") || "application/octet-stream",
            "Content-Disposition": `attachment; filename="${originalName}"`,
        },
    });
}