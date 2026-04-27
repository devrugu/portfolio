import FadeIn from "@/components/FadeIn";
import GitHubActivity from "@/components/GitHubActivity";
import Link from "next/link";

const skills = {
  "Languages": [
    { name: "C/C++", level: 90 },
    { name: "Python", level: 75 },
    { name: "JavaScript", level: 65 },
    { name: "PHP", level: 60 },
  ],
  "Frameworks & Libraries": [
    { name: "Qt Framework", level: 85 },
    { name: "Next.js", level: 65 },
    { name: "React", level: 60 },
  ],
  "Tools": [
    { name: "MATLAB", level: 80 },
    { name: "Git", level: 80 },
    { name: "CMake", level: 65 },
  ],
  "Databases": [
    { name: "MySQL", level: 70 },
    { name: "MongoDB", level: 60 },
  ],
};

function SkillLevel({ level }: { level: number }) {
  const dots = 5;
  const filled = Math.round((level / 100) * dots);
  return (
    <div className="flex gap-1">
      {Array.from({ length: dots }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${i < filled ? "bg-accent" : "bg-gray-600"}`}
        />
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <FadeIn>
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-primary mb-2">About Me</h1>
        <p className="text-accent font-medium mb-10">Software Engineer · Computer Engineer · Baglama Player</p>

        {/* Story */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">Who I Am</h2>
          <div className="space-y-4 text-on-background leading-relaxed">
            <p>
              I'm Uğurcan, a Computer Engineer from İstanbul, Türkiye. I currently work as a
              Software Engineer at <span className="text-accent font-medium">TÜBİTAK BİLGEM</span> —
              Turkey's leading research and development institution — where I contribute to
              the Integrated Sonar Systems Project, a large-scale defense industry initiative.
            </p>
            <p>
              My day-to-day work involves developing high-performance, real-time signal
              processing software using <span className="text-accent font-medium">modern C++17</span> and
              the <span className="text-accent font-medium">Qt framework</span>. I work on sonar
              algorithms, audio signal processing, and MATLAB code generation for optimized C integration.
              It's the kind of work where performance is not optional — real-time means real-time.
            </p>
            <p>
              Alongside my work, I'm pursuing an <span className="text-accent font-medium">M.Sc. in
                Computer Engineering</span> at Özyeğin University, conducted entirely in English, deepening
              my theoretical foundation in areas I'm passionate about.
            </p>
            <p>
              Before TÜBİTAK, I completed my B.Sc. at <span className="text-accent font-medium">Karadeniz
                Technical University</span> with a GPA of 3.15/4.00, graduating in 2023.
            </p>
          </div>
        </section>

        {/* What I do */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">What I Work On</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "📡",
                title: "Signal Processing",
                desc: "Real-time sonar signal processing, audio analysis, and algorithm optimization for defense systems.",
              },
              {
                icon: "⚡",
                title: "High-Performance C++",
                desc: "System-level software with C++17 and Qt, focused on performance, reliability, and maintainability.",
              },
              {
                icon: "🌐",
                title: "Full-Stack Web",
                desc: "Web applications with Next.js, React, PHP, and various databases — including this portfolio.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-primary font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-on-background leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-sm uppercase tracking-widest text-accent font-semibold mb-4">{category}</h3>
                <div className="space-y-3">
                  {items.map((skill) => (
                    <div key={skill.name} className="flex items-center justify-between">
                      <span className="text-primary text-sm">{skill.name}</span>
                      <SkillLevel level={skill.level} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">Languages</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { lang: "Turkish", level: "Native", color: "border-accent/50 text-accent" },
              { lang: "English", level: "B2 — YDS: 76", color: "border-gray-600 text-on-background" },
            ].map((l) => (
              <div key={l.lang} className={`border rounded-xl px-6 py-4 ${l.color}`}>
                <div className="font-semibold text-primary">{l.lang}</div>
                <div className="text-sm mt-0.5">{l.level}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Hobbies */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">Outside of Work</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { icon: "🎸", label: "Bağlama", desc: "Turkish folk music instrument" },
              { icon: "🎮", label: "Video Games", desc: "Always up for a good story-driven game" },
              { icon: "🐭", label: "Micromouse", desc: "Autonomous maze-solving robot competition" },
            ].map((hobby) => (
              <div key={hobby.label} className="flex items-center gap-3 bg-gray-800/50 border border-gray-700/50 rounded-xl px-5 py-4">
                <span className="text-2xl">{hobby.icon}</span>
                <div>
                  <div className="text-primary font-medium text-sm">{hobby.label}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{hobby.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GitHub Activity */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">GitHub Activity</h2>
          <GitHubActivity />
        </section>

        {/* CTA */}
        <section className="border-t border-gray-700/50 pt-10">
          <p className="text-on-background mb-6 text-lg">
            Interested in working together or just want to say hello?
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="bg-accent text-on-primary font-semibold px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors">
              Get In Touch
            </Link>
            <Link href="/resume" className="border border-accent/50 text-accent font-semibold px-6 py-3 rounded-lg hover:bg-accent/10 transition-colors">
              View Resume
            </Link>
          </div>
        </section>
      </div>
    </FadeIn>
  );
}