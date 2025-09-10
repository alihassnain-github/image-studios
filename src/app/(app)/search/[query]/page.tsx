import { ListFilter } from 'lucide-react';
import FilterBar, { FilterState } from '@/components/filter-bar';
import SearchSkeleton from '@/components/skeletons/search-skeleton';

export default function SearchPage() {

  return (
    <div className="min-h-screen flex flex-col">

      {/* Main Content */}
      <main className="flex-1 bg-base-100">
        {/* Align with navbar container widths */}
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-base-content">
              Rocket Photos
            </h1>
          </div>

          {/* Stat Bar and Filter Button */}
          <div className="flex items-center justify-between gap-4 mb-6">

            <button className="btn">
              Photos <div className="badge badge-sm badge-primary">155.7K</div>
            </button>

            <button className="btn">
              <ListFilter className="w-4 h-4" />
              Filters
              <div className="badge badge-soft badge-primary badge-primary badge-sm">01</div>
            </button>
          </div>

          <SearchSkeleton />

        </div>
      </main>

      {/* Filter Bar */}
      {/* <FilterBar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      /> */}

    </div>
  );
}
