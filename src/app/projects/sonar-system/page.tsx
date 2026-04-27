import RelatedProjects from "@/components/RelatedProjects";
import ProjectViewCounter from "@/components/ProjectViewCounter";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function SonarSystemPage() {
  return (
    <FadeIn>
      <div className="max-w-3xl">

        {/* Header */}
        <div className="flex items-start justify-between mb-2 gap-4">
          <h1 className="text-4xl font-bold text-primary">Onboard Sonar System</h1>
          <span className="flex-shrink-0 flex items-center gap-2 border border-gray-700 text-gray-500 text-sm px-4 py-2 rounded-lg">
            🔒 NDA
          </span>
        </div>
        <p className="text-accent font-medium mb-2">Defense Industry · Qt · C++17 · MATLAB</p>
        <p className="text-sm text-gray-500 italic mb-8">
          Source code and technical specifics are confidential under NDA. This page describes the project
          at a high level without disclosing proprietary or classified information.
        </p>

        {/* Overview */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">Overview</h2>
          <p className="text-on-background leading-relaxed mb-4">
            As a Software Engineer at <span className="text-accent font-medium">TÜBİTAK BİLGEM</span> —
            Turkey's leading research and information security institution — I contribute to the
            <span className="text-accent font-medium"> Integrated Sonar Systems Project</span>, a large-scale
            defense industry initiative developing onboard sonar systems for naval applications.
          </p>
          <p className="text-on-background leading-relaxed">
            The project involves developing, maintaining, and testing the complete suite of sonar signal
            processing software — from raw acoustic data acquisition through to processed output for
            operators. This is production-grade, mission-critical software where correctness and
            real-time performance are non-negotiable requirements.
          </p>
        </section>

        {/* My Contributions */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-6">My Contributions</h2>
          <div className="space-y-4">
            {[
              {
                icon: "🎵",
                title: "Audio Signal Processor",
                desc: "Developed the Audio Signal Processor software responsible for real-time processing of acoustic data from sonar transducers.",
              },
              {
                icon: "🎛️",
                title: "Audio Manager",
                desc: "Built the Audio Manager component that coordinates audio streams, manages device I/O, and ensures synchronized data flow across the system.",
              },
              {
                icon: "📡",
                title: "Signal Generator Software",
                desc: "Continued development and maintenance of the Signal Generator Software used for active/passive/analyser sonar simulation, testing, and debugging.",
              },
              {
                icon: "⚙️",
                title: "MATLAB Code Generation",
                desc: "Utilized MATLAB's code generation toolchain to convert sonar algorithms prototyped in MATLAB into optimized, real-time-ready C code for integration into the C++ system.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 bg-gray-800/40 border border-gray-700/40 rounded-xl p-5">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="text-primary font-semibold mb-1">{item.title}</h3>
                  <p className="text-on-background text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Environment */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">Technical Environment</h2>
          <div className="flex flex-wrap gap-3">
            {["C++17", "Qt Framework", "MATLAB", "Real-Time Processing", "Signal Processing", "Agile / Scrum", "Defense Systems"].map(tag => (
              <span key={tag} className="bg-gray-800/60 border border-gray-700/50 text-on-background text-sm px-4 py-2 rounded-lg">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* What I Learned */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">What This Work Has Taught Me</h2>
          <ul className="space-y-3">
            {[
              "Real-time constraints are fundamentally different from typical software — latency budgets are measured in microseconds and there is no tolerance for non-deterministic behavior.",
              "Large-scale C++ development demands strict architectural discipline — module boundaries, interface design, and memory management are critical at this scale.",
              "MATLAB code generation is a powerful workflow: prototype algorithms rapidly in MATLAB, then generate optimized C code for production integration.",
              "Working in a defense context means understanding safety-critical software practices, rigorous testing, and documentation standards that go beyond typical industry norms.",
              "Collaboration in a large engineering team on a long-running project has been the most valuable professional development experience of my career so far.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-on-background text-sm leading-relaxed">
                <span className="text-accent mt-0.5 flex-shrink-0">▸</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* NDA notice */}
        <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-5 mb-10">
          <p className="text-gray-400 text-sm leading-relaxed">
            <span className="text-gray-300 font-semibold">Note on confidentiality:</span> Due to the
            sensitive nature of defense industry work and my NDA with TÜBİTAK BİLGEM, I'm unable to share
            source code, technical specifications, system architecture details, or any information that
            could compromise the security of the project. The description above reflects only what is
            publicly known about the general nature of sonar systems work.
          </p>
        </div>

        <RelatedProjects currentSlug="sonar-system" />

        <div className="mt-10">
          <Link href="/#projects" className="inline-flex items-center gap-2 text-accent hover:underline text-sm">
            ← Back to Projects
          </Link>
        </div>
      </div>
    </FadeIn>
  );
}