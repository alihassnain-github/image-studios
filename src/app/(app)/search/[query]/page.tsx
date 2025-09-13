import SearchSkeleton from '@/components/skeletons/search-skeleton';
import FilterBar from '@/components/filter-bar';
import { toTitleCase } from '@/lib/format';

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ query: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

  const { query } = await params;

  const filters = (await searchParams);

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
              Photos <div className="badge badge-sm badge-primary">155.7K</div>
            </button>

          </div>

          <SearchSkeleton />

        </div>
      </main>
    </div>
  );
}
