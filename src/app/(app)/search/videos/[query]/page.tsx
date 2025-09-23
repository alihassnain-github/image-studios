import type { Metadata, ResolvingMetadata } from 'next'
import { formatNumber, normalizeParam, toTitleCase } from '@/utils/format';
import { getData } from '@/utils/api-helpers';
import VideosContainer from '@/components/videos-container';

type Props = {
    params: Promise<{ query: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    const { query } = await params

    const { orientation, size } = (await searchParams);

    const filters = {
        orientation: normalizeParam(orientation),
        size: normalizeParam(size),
    };

    const queryString = new URLSearchParams({
        query,
        ...(filters.orientation && { orientation: filters.orientation }),
        ...(filters.size && { size: filters.size }),
    }).toString();

    const data = await getData(`${process.env.PEXELS_API_URI}/videos/search?${queryString}`, "VideosSearchPage", { next: { revalidate: 60 }, headers: { Authorization: process.env.PEXELS_API_KEY } });

    const readableQuery = toTitleCase(decodeURIComponent(query));

    return {
        title: `Free ${readableQuery} Videos | Image Studios`,
        description: `Discover ${formatNumber(
            data.total_results
        )} free ${readableQuery} videos. Download high-quality ${readableQuery} videos in landscape, portrait, and square orientations.`,
    }
}

export default async function SearchPage({
    params,
    searchParams,
}: {
    params: Promise<{ query: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    const { query } = await params;

    const { orientation, size } = (await searchParams);

    const filters = {
        orientation: normalizeParam(orientation),
        size: normalizeParam(size),
    };

    const queryString = new URLSearchParams({
        query,
        ...(filters.orientation && { orientation: filters.orientation }),
        ...(filters.size && { size: filters.size }),
        per_page: "20",
    }).toString();

    const data = await getData(`${process.env.PEXELS_API_URI}/videos/search?${queryString}`, "VideosSearchPage", { next: { revalidate: 60 }, headers: { Authorization: process.env.PEXELS_API_KEY } });

    console.log(data);

    return (
        <div className="min-h-screen flex flex-col">

            {/* Main Content */}
            <main className="flex-1 bg-base-100">
                {/* Align with navbar container widths */}
                <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6">
                    {/* Page Title */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-base-content">
                            Free {toTitleCase(decodeURIComponent(query))} Videos
                        </h1>
                    </div>

                    <VideosContainer initialData={data} />

                </div>
            </main>
        </div>
    );
}
