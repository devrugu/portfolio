import RelatedProjects from "@/components/RelatedProjects";
import ProjectViewCounter from "@/components/ProjectViewCounter";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function HistogramAnalysisPage() {
    return (
        <FadeIn>
            <div className="max-w-3xl">

                <div className="flex items-start justify-between mb-2 gap-4">
                    <h1 className="text-4xl font-bold text-primary">Histogram Analysis on Gray Level Image</h1>
                    <a
                        href="https://github.com/devrugu/histogram-analysis"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 flex items-center gap-2 border border-gray-600 text-on-background text-sm px-4 py-2 rounded-lg hover:border-accent hover:text-accent transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                        </svg>
                        View on GitHub
                    </a>
                </div>
                <div className="flex items-center gap-4 mb-8">
                    <p className="text-accent font-medium">Image Processing · C</p>
                    <ProjectViewCounter slug="histogram-analysis" />
                </div>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-primary mb-4">Overview</h2>
                    <p className="text-on-background leading-relaxed mb-4">
                        A C implementation of fundamental <span className="text-accent font-medium">histogram analysis
                            techniques</span> applied to grayscale images. The project covers computing intensity
                        histograms, histogram equalization for contrast enhancement, and histogram stretching —
                        all implemented from scratch without any image processing libraries.
                    </p>
                    <p className="text-on-background leading-relaxed">
                        This project sits at the foundation of computer vision and image processing — understanding
                        how pixel intensity distributions work is essential before moving to more advanced techniques
                        like edge detection, segmentation, or deep learning-based analysis.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-primary mb-6">Techniques Implemented</h2>
                    <div className="space-y-4">
                        {[
                            {
                                title: "Histogram Computation",
                                desc: "Count the frequency of each intensity level (0–255) across all pixels in the grayscale image, producing a distribution that characterizes the image's overall brightness and contrast.",
                            },
                            {
                                title: "Histogram Equalization",
                                desc: "Redistribute pixel intensities using the cumulative distribution function (CDF) to spread them more evenly across the full range — dramatically improving contrast in low-quality or underexposed images.",
                            },
                            {
                                title: "Histogram Stretching",
                                desc: "Linearly scale pixel intensities so the darkest pixel maps to 0 and the brightest to 255, maximizing the dynamic range of the image.",
                            },
                            {
                                title: "Statistical Analysis",
                                desc: "Compute mean, variance, and standard deviation of pixel intensities to quantitatively describe image characteristics.",
                            },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold text-sm">
                                    {i + 1}
                                </div>
                                <div>
                                    <h3 className="text-primary font-semibold mb-1">{item.title}</h3>
                                    <p className="text-on-background text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-primary mb-4">Tech Stack</h2>
                    <div className="flex flex-wrap gap-3">
                        {["C", "GCC", "Raw Pixel Manipulation", "Image Processing Fundamentals"].map(tag => (
                            <span key={tag} className="bg-gray-800/60 border border-gray-700/50 text-on-background text-sm px-4 py-2 rounded-lg">
                                {tag}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-primary mb-4">Key Learnings</h2>
                    <ul className="space-y-3">
                        {[
                            "Learned how images are represented as 2D arrays of pixel intensities and how to manipulate them at the byte level in C.",
                            "Understood the mathematical relationship between spatial domain operations and their statistical effects on image quality.",
                            "Histogram equalization is one of the most elegant algorithms in image processing — a simple idea that produces dramatically visible improvements.",
                            "This foundational knowledge directly feeds into my current work applying deep learning to sonar image analysis — understanding raw pixel distributions is essential for data preprocessing and augmentation.",
                        ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-on-background text-sm leading-relaxed">
                                <span className="text-accent mt-0.5 flex-shrink-0">▸</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                <RelatedProjects currentSlug="histogram-analysis" />

                <div className="mt-10">
                    <Link href="/#projects" className="inline-flex items-center gap-2 text-accent hover:underline text-sm">
                        ← Back to Projects
                    </Link>
                </div>
            </div>
        </FadeIn>
    );
}