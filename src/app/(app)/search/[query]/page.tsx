import type { Metadata, ResolvingMetadata } from 'next'
import MasonryGrid from '@/components/masonry-grid';
import FilterBar from '@/components/filter-bar';
import { formatNumber, normalizeParam, toTitleCase } from '@/utils/format';
import { getData } from '@/utils/api-helpers';
import { Suspense } from 'react';
import SearchSkeleton from '@/components/skeletons/search-skeleton';

type Props = {
  params: Promise<{ query: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { query } = await params

  const { orientation, color, size } = (await searchParams);

  const filters = {
    orientation: normalizeParam(orientation),
    size: normalizeParam(size),
    color: normalizeParam(color),
  };

  const queryString = new URLSearchParams({
    query,
    ...(filters.orientation && { orientation: filters.orientation }),
    ...(filters.size && { size: filters.size }),
    ...(filters.color && { color: filters.color }),
  }).toString();

  const data = await getData(`${process.env.PEXELS_API_URI}/search?${queryString}`, "SearchPage", { next: { revalidate: 60 }, headers: { Authorization: process.env.PEXELS_API_KEY } });

  const readableQuery = toTitleCase(decodeURIComponent(query));

  return {
    title: `Free ${readableQuery} Photos | Image Studios`,
    description: `Discover ${formatNumber(
      data.total_results
    )} free ${readableQuery} photos. Download high-quality ${readableQuery} images in landscape, portrait, and square orientations.`,
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

  const { orientation, color, size } = (await searchParams);

  const filters = {
    orientation: normalizeParam(orientation),
    size: normalizeParam(size),
    color: normalizeParam(color),
  };

  const queryString = new URLSearchParams({
    query,
    ...(filters.orientation && { orientation: filters.orientation }),
    ...(filters.size && { size: filters.size }),
    ...(filters.color && { color: filters.color }),
  }).toString();

  const data = await getData(`${process.env.PEXELS_API_URI}/search?${queryString}`, "SearchPage", { next: { revalidate: 60 }, headers: { Authorization: process.env.PEXELS_API_KEY } });

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
              Free {toTitleCase(decodeURIComponent(query))} Photos
            </h1>
          </div>

          {/* Stat Bar and Filter Button */}
          <div className="flex items-center justify-between gap-4 mb-6">

            {/* Filter Bar */}
            <FilterBar />

            <button className="btn">
              Photos <div className="badge badge-sm badge-primary">{formatNumber(data.total_results)}</div>
            </button>

          </div>

          <Suspense fallback={<SearchSkeleton />}>
            <MasonryGrid dataFetchingQuery={queryString} type={"image"} />
          </Suspense>

        </div>
      </main>
    </div>
  );
}
