export default function SearchSkeleton() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    {/* image placeholder */}
                    <div className="skeleton w-full rounded-xl h-[240px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[500px]"></div>
                </div>
            ))}
        </div>
    );
}
