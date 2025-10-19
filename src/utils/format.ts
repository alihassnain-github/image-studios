import { FormattedVideo, PexelsVideoFile } from "@/types/video";

export function toTitleCase(str: string) {
    return str
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

export function normalizeParam(value: string | string[] | undefined): string {
    if (Array.isArray(value)) return value[0]; // take first one
    return value ?? ""; // fallback to empty string
}

export function formatNumber(num: number): string {
    const units = [
        { value: 1_000_000_000, suffix: 'B' },
        { value: 1_000_000, suffix: 'M' },
        { value: 1_000, suffix: 'K' },
    ];

    for (const unit of units) {
        if (num >= unit.value) {
            return (num / unit.value).toFixed(1).replace(/\.0$/, '') + unit.suffix;
        }
    }

    return num.toString();
}

export function formatVideoFiles(files: PexelsVideoFile[]): FormattedVideo[] {
    const formatted = files
        .filter(file => file.width !== null && file.height !== null) // Filter out HLS or files without dimensions
        .map(file => {
            const { width, height } = file;
            let label = '';
            let sortOrder = 0;

            // Calculate total pixels for better quality detection
            const pixels = width! * height!;

            // Determine quality label and sort order based on resolution
            if (pixels >= 8294400) { // 3840×2160 = 8,294,400
                label = '4K UHD';
                sortOrder = 1;
            } else if (pixels >= 3686400) { // 2560×1440 = 3,686,400
                label = 'Quad HD';
                sortOrder = 2;
            } else if (pixels >= 2073600) { // 1920×1080 = 2,073,600
                label = 'Full HD';
                sortOrder = 3;
            } else if (pixels >= 921600) { // 1280×720 = 921,600
                label = 'HD';
                sortOrder = 4;
            } else {
                label = 'SD';
                sortOrder = 5;
            }

            return {
                id: file.id,
                label,
                resolution: `${width} × ${height}`,
                width,
                height,
                link: file.link,
                sortOrder
            };
        });

    // Sort by quality (lowest to highest)
    return formatted.sort((a, b) => b.sortOrder - a.sortOrder);
}
