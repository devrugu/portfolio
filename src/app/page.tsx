import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import TextScramble from '@/components/TextScramble';
import FadeIn from '@/components/FadeIn';
import AnimatedCard from '@/components/AnimatedCard';
import StaggeredList from '@/components/StaggeredList';
import TrackedLink from '@/components/TrackedLink';

async function getAuthorImage() {
  const query = `*[_type == "author"][0] { image }`;
  const data = await client.fetch(query, {}, { next: { revalidate: 60 } });
  return data?.image;
}

// Work start date — used to compute years of experience
const WORK_START_YEAR = 2023;

const projects = [
  {
    title: "Onboard Sonar System",
    description:
      "Developed Audio Signal Processor and Audio Manager software, and continued development of signal generator software for active/passive sonar analysis.",
    tags: ["Qt", "C++17", "Matlab"],
    tagColors: ["bg-green-500", "bg-tagColors-cpp", "bg-blue-500"],
    link: "/projects/sonar-system",
    nda: true,
  },
  {
    title: "FIR Band-Pass Filter",
    description:
      "A low-level implementation of a Finite Impulse Response (FIR) digital filter in the C programming language, focusing on performance and accuracy.",
    tags: ["C"],
    tagColors: ["bg-tagColors-cpp"],
    link: "/projects/fir-filter",
    nda: false,
  },
  {
    title: "Fragile Digital Watermarking",
    description:
      "An implementation of a digital watermarking algorithm in Python to embed and detect fragile watermarks in digital images.",
    tags: ["Python"],
    tagColors: ["bg-tagColors-python"],
    link: "/projects/digital-watermarking",
    nda: false,
  },
  {
    title: "Healthcare Management System",
    description:
      "A full-stack web application for managing healthcare records and appointments, built with a classic LAMP stack.",
    tags: ["PHP", "HTML/CSS", "MySQL"],
    tagColors: ["bg-tagColors-php", "bg-orange-500", "bg-tagColors-mysql"],
    link: "/projects/healthcare-system",
    nda: false,
  },
  {
    title: "Event and Certificate System",
    description:
      "A web-based platform for managing event registrations and generating digital certificates for attendees.",
    tags: ["PHP", "HTML/CSS", "MySQL"],
    tagColors: ["bg-tagColors-php", "bg-orange-500", "bg-tagColors-mysql"],
    link: "/projects/event-certificate",
    nda: false,
  },
  {
    title: "Regular Expression Engine",
    description:
      "A simple regex engine built with JavaScript to parse and match patterns in strings, with a focus on understanding the core mechanics.",
    tags: ["JavaScript", "HTML/CSS"],
    tagColors: ["bg-tagColors-javascript", "bg-orange-500"],
    link: "/projects/regex-engine",
    nda: false,
  },
];

const experienceYears = new Date().getFullYear() - WORK_START_YEAR;

export default async function HomePage() {
  const authorImage = await getAuthorImage();

  return (
    <FadeIn>
      <div>
        {/* Hero Section */}
        <section className="flex flex-col-reverse md:flex-row items-center gap-12 mb-24">
          {/* Left Column */}
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              <span className="text-accent"><TextScramble text="Hi," /></span>{' '}
              <TextScramble text="I'm Uğurcan Yılmaz" />
            </h1>
            <p className="text-lg text-on-background mb-4">
              I'm a Computer Engineer based in İstanbul, Türkiye, currently working as a
              Software Engineer at TÜBİTAK BİLGEM. I specialize in developing
              high-performance, real-time signal processing software using C++ and the Qt
              framework.
            </p>
            <p className="text-lg text-on-background mb-6">
              My work on large-scale defense industry projects involves:
            </p>
            <ul className="list-disc list-inside text-lg text-on-background space-y-2 mb-8">
              <li>Developing sonar algorithms and real-time processing applications.</li>
              <li>Optimizing MATLAB code generation for integration into C++ systems.</li>
              <li>Enhancing system performance and developing full-stack applications.</li>
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/resume"
                className="bg-accent text-on-primary font-semibold px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors"
              >
                View Resume
              </Link>
              <Link
                href="/contact"
                className="border border-accent/50 text-accent font-semibold px-6 py-3 rounded-lg hover:bg-accent/10 transition-colors"
              >
                Get In Touch
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <TrackedLink
                href="https://github.com/devrugu"
                eventAction="click"
                eventCategory="Social Links"
                eventLabel="GitHub Profile"
                className="text-primary hover:text-accent transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </TrackedLink>
              <TrackedLink
                href="https://tr.linkedin.com/in/kazuhira"
                eventAction="click"
                eventCategory="Social Links"
                eventLabel="LinkedIn Profile"
                className="text-primary hover:text-accent transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </TrackedLink>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:w-1/3 flex justify-center">
            <div className="flex flex-col items-center gap-4">
              {authorImage && (
                <Image
                  src={urlFor(authorImage).width(300).height(300).url()}
                  alt="Uğurcan Yılmaz"
                  width={300}
                  height={300}
                  className="rounded-full border-4 border-gray-700/50 object-cover"
                  priority
                />
              )}
              {/* Professional experience badge instead of age counter */}
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-4xl font-bold text-accent">{experienceYears}+</span>
                <span className="text-sm text-gray-400 tracking-wide uppercase">Years of Experience</span>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-24">
          <h2 className="text-4xl font-bold text-primary mb-8">Technical Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "C/C++",       icon: "⚙️",  category: "Language"   },
              { name: "Qt",          icon: "🖥️",  category: "Framework"  },
              { name: "Python",      icon: "🐍",  category: "Language"   },
              { name: "MATLAB",      icon: "📊",  category: "Tool"       },
              { name: "JavaScript",  icon: "🟨",  category: "Language"   },
              { name: "Next.js",     icon: "▲",   category: "Framework"  },
              { name: "React",       icon: "⚛️",  category: "Framework"  },
              { name: "Git",         icon: "🌿",  category: "Tool"       },
              { name: "CMake",       icon: "🔨",  category: "Tool"       },
              { name: "MySQL",       icon: "🐬",  category: "Database"   },
              { name: "MongoDB",     icon: "🍃",  category: "Database"   },
              { name: "PHP",         icon: "🐘",  category: "Language"   },
            ].map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-3 bg-gray-800/40 border border-gray-700/40 rounded-xl px-4 py-3 hover:border-accent/40 hover:bg-gray-800/70 transition-colors"
              >
                <span className="text-xl leading-none">{tech.icon}</span>
                <div>
                  <div className="text-primary text-sm font-medium">{tech.name}</div>
                  <div className="text-gray-500 text-xs">{tech.category}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects">
          <h2 className="text-4xl font-bold text-primary mb-8">Projects</h2>
          <StaggeredList>
            {projects.map((project, index) => (
              <AnimatedCard
                key={index}
                href={project.nda ? undefined : project.link ?? undefined}
                index={index}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="text-xl font-semibold text-accent">{project.title}</h3>
                    {project.nda ? (
                      <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-700 text-gray-400 border border-gray-600">
                        NDA
                      </span>
                    ) : project.link && project.link.startsWith("http") ? (
                      <span className="flex-shrink-0 text-gray-400 hover:text-accent transition-colors" title="View on GitHub">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                        </svg>
                      </span>
                    ) : null}
                  </div>
                  <p className="text-on-background flex-grow mb-4">{project.description}</p>
                  {project.nda && (
                    <p className="text-xs text-gray-500 mb-3 italic">
                      Source code is confidential under NDA due to the nature of defense industry work.
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${project.tagColors[tagIndex] || 'bg-gray-600'} text-white`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </StaggeredList>
        </section>
      </div>
    </FadeIn>
  );
}