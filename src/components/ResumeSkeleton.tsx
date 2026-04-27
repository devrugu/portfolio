export default function ResumeSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Header */}
            <div className="flex items-center gap-6 mb-10">
                <div className="w-24 h-24 rounded-full bg-gray-700/50 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                    <div className="h-8 bg-gray-700/50 rounded-lg w-48" />
                    <div className="h-4 bg-gray-700/30 rounded w-64" />
                    <div className="h-4 bg-gray-700/30 rounded w-56" />
                </div>
                <div className="h-10 w-36 bg-gray-700/30 rounded-lg" />
            </div>

            {/* Summary */}
            <div className="mb-8">
                <div className="h-5 bg-gray-700/50 rounded w-24 mb-3" />
                <div className="space-y-2">
                    <div className="h-4 bg-gray-700/30 rounded w-full" />
                    <div className="h-4 bg-gray-700/30 rounded w-5/6" />
                    <div className="h-4 bg-gray-700/30 rounded w-4/6" />
                </div>
            </div>

            {/* Experience */}
            <div className="mb-8">
                <div className="h-5 bg-gray-700/50 rounded w-32 mb-4" />
                {[1, 2].map(i => (
                    <div key={i} className="mb-6 pl-4 border-l-2 border-gray-700/50">
                        <div className="flex justify-between mb-2">
                            <div className="h-5 bg-gray-700/40 rounded w-40" />
                            <div className="h-4 bg-gray-700/30 rounded w-28" />
                        </div>
                        <div className="h-4 bg-gray-700/30 rounded w-36 mb-3" />
                        <div className="space-y-1.5">
                            <div className="h-3 bg-gray-700/20 rounded w-full" />
                            <div className="h-3 bg-gray-700/20 rounded w-5/6" />
                            <div className="h-3 bg-gray-700/20 rounded w-4/6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Skills */}
            <div>
                <div className="h-5 bg-gray-700/50 rounded w-20 mb-4" />
                <div className="space-y-4">
                    {[80, 65, 90, 70, 55].map((w, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="h-4 bg-gray-700/30 rounded w-28" />
                            <div className="flex-1 h-2 bg-gray-700/20 rounded-full">
                                <div className="h-2 bg-gray-700/40 rounded-full" style={{ width: `${w}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}