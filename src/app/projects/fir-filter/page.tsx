import RelatedProjects from "@/components/RelatedProjects";
import ProjectViewCounter from "@/components/ProjectViewCounter";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

const steps = [
  {
    title: "Define Filter Specifications",
    desc: "Determine the desired passband (1–3 kHz), stopband frequencies, and acceptable ripple levels for the application.",
  },
  {
    title: "Calculate Filter Coefficients",
    desc: "Use the windowed-sinc method with a Hamming window to compute the FIR coefficients that shape the frequency response.",
  },
  {
    title: "Implement Convolution",
    desc: "Apply the filter by convolving the input signal with the computed coefficients using a direct-form FIR structure in C.",
  },
  {
    title: "Validate Output",
    desc: "Feed test signals at various frequencies and verify that only the target band passes through while others are attenuated.",
  },
];

export default function FIRFilterPage() {
  return (
    <FadeIn>
      <div className="max-w-3xl">

        {/* Header */}
        <div className="flex items-start justify-between mb-2 gap-4">
          <h1 className="text-4xl font-bold text-primary">FIR Band-Pass Filter</h1>
          <a
            href="https://github.com/devrugu/fir-band-pass-filter"
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
          <p className="text-accent font-medium">Digital Signal Processing · C</p>
          <ProjectViewCounter slug="fir-filter" />
        </div>

        {/* Overview */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">Overview</h2>
          <p className="text-on-background leading-relaxed mb-4">
            A low-level implementation of a <span className="text-accent font-medium">Finite Impulse Response (FIR) band-pass filter</span> written
            entirely in C, without any DSP libraries. The project demonstrates a deep understanding of
            digital signal processing fundamentals — specifically how to isolate a specific frequency band
            from a mixed signal using convolution.
          </p>
          <p className="text-on-background leading-relaxed">
            The filter is designed to pass frequencies between <span className="text-accent font-medium">1 kHz and 3 kHz</span> while
            attenuating all other frequency components. This type of filter is foundational in audio processing,
            communications, and — particularly relevant to my professional work — sonar signal processing.
          </p>
        </section>

        {/* The Problem */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">The Problem</h2>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <p className="text-on-background leading-relaxed">
              Real-world signals contain noise and unwanted frequency components mixed in with the desired signal.
              A band-pass filter solves this by selectively allowing only a specific range of frequencies to pass
              through, rejecting everything outside that range. Implementing this from scratch in C requires
              understanding the mathematics of convolution, windowing functions, and the frequency-domain
              characteristics of filter design — all without relying on higher-level abstractions.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-6">How It Works</h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-primary font-semibold mb-1">{step.title}</h3>
                  <p className="text-on-background text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {["C", "GCC Compiler", "Windowed-Sinc Method", "Hamming Window", "Direct-Form FIR"].map(tag => (
              <span key={tag} className="bg-gray-800/60 border border-gray-700/50 text-on-background text-sm px-4 py-2 rounded-lg">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Key Learnings */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">Key Learnings</h2>
          <ul className="space-y-3">
            {[
              "Deepened understanding of the relationship between time-domain convolution and frequency-domain filtering.",
              "Learned how windowing functions (Hamming, Hanning, Blackman) affect the trade-off between transition bandwidth and stopband attenuation.",
              "Gained appreciation for numerical precision issues when implementing DSP algorithms in fixed-point C.",
              "This project directly prepared me for working on real-time sonar signal processing at TÜBİTAK BİLGEM.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-on-background text-sm leading-relaxed">
                <span className="text-accent mt-0.5 flex-shrink-0">▸</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Back */}
        <RelatedProjects currentSlug="fir-filter" />

        <div className="mt-10">
          <Link href="/#projects" className="inline-flex items-center gap-2 text-accent hover:underline text-sm">
            ← Back to Projects
          </Link>
        </div>
      </div>
    </FadeIn>
  );
}