import FadeIn from "@/components/FadeIn";
import Link from "next/link";

const lastUpdated = "April 2026";

export default function NowPage() {
  return (
    <FadeIn>
      <div className="max-w-2xl">

        {/* Header */}
        <h1 className="text-4xl font-bold text-primary mb-2">Now</h1>
        <p className="text-sm text-gray-500 mb-10">
          What I'm doing right now — updated {lastUpdated}.{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            What is a now page?
          </a>
        </p>

        <div className="space-y-12">

          {/* Working on */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">⚡</span>
              <h2 className="text-2xl font-semibold text-primary">Working On</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-5">
                <h3 className="text-accent font-semibold mb-2">
                  Autonomous Underwater Vehicle — Side Scan Sonar
                </h3>
                <p className="text-on-background text-sm leading-relaxed">
                  Developing AI systems for an autonomous underwater vehicle (AUV) equipped with a
                  side scan sonar. The work involves creating and fine-tuning deep learning models
                  to analyze high-frequency sonar images — classifying underwater mines, tracking
                  pipelines, and detecting anomalies on the seafloor. It sits at the intersection
                  of computer vision and underwater acoustics, and it's some of the most challenging
                  and rewarding work I've done.
                </p>
              </div>
              <div className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-5">
                <h3 className="text-accent font-semibold mb-2">
                  This Portfolio
                </h3>
                <p className="text-on-background text-sm leading-relaxed">
                  Continuously improving this site — adding new features, writing content, and
                  experimenting with new ideas. It's a living project that grows alongside me.
                </p>
              </div>
            </div>
          </section>

          {/* Learning */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">🧠</span>
              <h2 className="text-2xl font-semibold text-primary">Learning</h2>
            </div>
            <div className="space-y-3">
              {[
                {
                  title: "Deep Learning",
                  desc: "Studying neural network architectures, backpropagation, optimization, CNNs, and transformers as part of my M.Sc. at Özyeğin University.",
                  tag: "M.Sc. Course",
                },
                {
                  title: "Computer Vision",
                  desc: "Image classification, object detection, segmentation, and applying these to real-world sensor data — especially sonar and radar imagery.",
                  tag: "M.Sc. Course",
                },
                {
                  title: "Applied AI & ML",
                  desc: "Exploring the broader landscape of AI — model fine-tuning, transfer learning, and deploying ML models in production environments.",
                  tag: "Self-Study",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-start">
                  <span className="text-accent mt-1 flex-shrink-0">▸</span>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-primary font-medium text-sm">{item.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-400">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-on-background text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reading / Watching / Playing */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">🎮</span>
              <h2 className="text-2xl font-semibold text-primary">Reading / Watching / Playing</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  emoji: "🎮",
                  type: "Playing",
                  title: "The Last of Us Part II",
                  desc: "Emotionally brutal, visually stunning, and one of the best stories in gaming. Taking my time with it.",
                },
                {
                  emoji: "📺",
                  type: "Watching",
                  title: "Invincible",
                  desc: "The animated series. Exactly what superhero storytelling should be — mature, unpredictable, and genuinely surprising.",
                },
                {
                  emoji: "📚",
                  type: "Reading",
                  title: "Deep Learning Papers",
                  desc: "Working through seminal papers — Attention Is All You Need, ResNet, YOLO variants — as part of my M.Sc. coursework.",
                },
              ].map((item) => (
                <div
                  key={item.type}
                  className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-5"
                >
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">
                    {item.type}
                  </div>
                  <div className="text-primary font-semibold text-sm mb-1">{item.title}</div>
                  <p className="text-on-background text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Location & context */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">📍</span>
              <h2 className="text-2xl font-semibold text-primary">Where I Am</h2>
            </div>
            <p className="text-on-background text-sm leading-relaxed">
              Based in <span className="text-accent font-medium">İstanbul, Türkiye</span>. Working full-time
              at TÜBİTAK BİLGEM in Kocaeli while pursuing my M.Sc. at Özyeğin University in the evenings.
              Busy, but exactly where I want to be.
            </p>
          </section>

          {/* Divider + note */}
          <div className="border-t border-gray-700/50 pt-8">
            <p className="text-gray-500 text-sm">
              This page was inspired by{" "}
              <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                nownownow.com
              </a>
              {" "}— a movement of people sharing what they're focused on right now.
              Last updated: <span className="text-gray-400">{lastUpdated}</span>.
            </p>
          </div>

        </div>
      </div>
    </FadeIn>
  );
}