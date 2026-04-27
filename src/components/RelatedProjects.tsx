import Link from "next/link";

interface Project {
    slug: string;
    title: string;
    description: string;
    tags: string[];
}

const ALL_PROJECTS: Project[] = [
    { slug: "sonar-system", title: "Onboard Sonar System", tags: ["C++", "Qt", "MATLAB", "Signal Processing"], description: "Real-time sonar signal processing software for integrated naval systems at TÜBİTAK BİLGEM." },
    { slug: "fir-filter", title: "FIR Band-Pass Filter", tags: ["C", "Signal Processing", "DSP"], description: "Low-level FIR digital filter implementation in C, focusing on performance and accuracy." },
    { slug: "digital-watermarking", title: "Fragile Digital Watermarking", tags: ["Python", "Image Processing"], description: "LSB watermarking algorithm to embed and detect fragile watermarks in digital images." },
    { slug: "healthcare-system", title: "Healthcare Management System", tags: ["PHP", "MySQL", "Full-Stack"], description: "Full-stack web app for managing healthcare records and appointments." },
    { slug: "event-certificate", title: "Event & Certificate System", tags: ["PHP", "MySQL", "Full-Stack", "PDF"], description: "Web platform for managing event registrations and generating digital certificates." },
    { slug: "regex-engine", title: "Regular Expression Engine", tags: ["JavaScript", "Algorithms"], description: "A regex engine built in JavaScript to parse and match patterns from scratch." },
    { slug: "histogram-analysis", title: "Histogram Analysis", tags: ["C", "Image Processing"], description: "Histogram computation, equalization, and stretching on grayscale images in C." },
];

function getRelated(currentSlug: string, count = 2): Project[] {
    const current = ALL_PROJECTS.find(p => p.slug === currentSlug);
    if (!current) return ALL_PROJECTS.filter(p => p.slug !== currentSlug).slice(0, count);

    // Score by number of shared tags
    const scored = ALL_PROJECTS
        .filter(p => p.slug !== currentSlug)
        .map(p => ({
            project: p,
            score: p.tags.filter(t => current.tags.includes(t)).length,
        }))
        .sort((a, b) => b.score - a.score);

    return scored.slice(0, count).map(s => s.project);
}

interface Props {
    currentSlug: string;
}

export default function RelatedProjects({ currentSlug }: Props) {
    const related = getRelated(currentSlug);
    if (related.length === 0) return null;

    return (
        <div className="mt-16 pt-10 border-t border-gray-700/50">
            <h2 className="text-xl font-semibold text-primary mb-5">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {related.map(project => (
                    <Link
                        key={project.slug}
                        href={`/projects/${project.slug}`}
                        className="group bg-gray-800/40 border border-gray-700/40 hover:border-accent/50 rounded-xl p-5 transition-all hover:bg-gray-800/70"
                    >
                        <h3 className="text-primary font-semibold text-sm group-hover:text-accent transition-colors mb-2">
                            {project.title}
                        </h3>
                        <p className="text-on-background text-xs leading-relaxed mb-3 line-clamp-2">
                            {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {project.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-400">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}