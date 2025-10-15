import SearchBar from '@/components/searchbar';
import Link from 'next/link';

const categoryChips = [
  { name: 'Nature', icon: '🌿' },
  { name: 'Technology', icon: '💻' },
  { name: 'Travel', icon: '✈️' },
  { name: 'Food', icon: '🍕' },
  { name: 'Business', icon: '💼' },
  { name: 'Art', icon: '🎨' },
];

export default function HomePage() {

  return (
    <main className="flex-1 hero min-h-screen" style={{
      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>

      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content z-10">
        <div className="max-w-4xl">
          <h1 className="mb-8 text-5xl md:text-6xl font-bold">
            Discover Amazing Images
          </h1>
          <p className="mb-8 text-xl md:text-2xl">
            Search millions of free stock photos and videos
          </p>

          {/* Search Bar */}
          <SearchBar />

          {/* Category Chips */}
          <div className="flex flex-wrap justify-center gap-3">
            {categoryChips.map((category) => (
              <Link key={category.name} href={`/search/${category.name}`} prefetch={false}>
                <button
                  className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-primary"
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="stats stats-vertical md:stats-horizontal shadow mt-12 bg-base-100 bg-opacity-90 text-black">
            <div className="stat">
              <div className="stat-title">Total Images</div>
              <div className="stat-value text-primary">2M+</div>
              <div className="stat-desc">High quality photos</div>
            </div>
            <div className="stat">
              <div className="stat-title">Videos</div>
              <div className="stat-value text-secondary">500K+</div>
              <div className="stat-desc">4K quality videos</div>
            </div>
            <div className="stat">
              <div className="stat-title">Downloads</div>
              <div className="stat-value text-accent">10M+</div>
              <div className="stat-desc">Free downloads</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
