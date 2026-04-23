import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function EventCertificatePage() {
  return (
    <FadeIn>
      <div className="max-w-3xl">

        {/* Header */}
        <div className="flex items-start justify-between mb-2 gap-4">
          <h1 className="text-4xl font-bold text-primary">Event & Certificate System</h1>
          <a
            href="https://github.com/devrugu/event-certificate-system"
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
        <p className="text-accent font-medium mb-8">Full-Stack Web Application · PHP · MySQL</p>

        {/* Overview */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">Overview</h2>
          <p className="text-on-background leading-relaxed mb-4">
            A web platform for managing <span className="text-accent font-medium">event registrations</span> and
            automatically generating <span className="text-accent font-medium">digital participation certificates</span> for
            attendees. Organizers can create events, manage registrations, and distribute personalized PDF
            certificates — all through a single web interface.
          </p>
          <p className="text-on-background leading-relaxed">
            The standout feature is the <span className="text-accent font-medium">on-the-fly certificate generation</span> —
            when an attendee's participation is confirmed, the system dynamically creates a personalized
            certificate PDF with their name, event details, and date, ready for download or email delivery.
          </p>
        </section>

        {/* How It Works */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-6">How It Works</h2>
          <div className="space-y-4">
            {[
              { title: "Event Creation", desc: "Organizers create events with title, description, date, location, and maximum capacity." },
              { title: "Registration", desc: "Attendees register by providing their details. The system validates capacity and prevents duplicate registrations." },
              { title: "Attendance Confirmation", desc: "Organizers mark attendees as confirmed after the event." },
              { title: "Certificate Generation", desc: "Confirmed attendees can download a dynamically generated PDF certificate with their personal details embedded." },
              { title: "Admin Dashboard", desc: "Full overview of all events, registration counts, and attendee management." },
            ].map((step, i) => (
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
            {["PHP 8", "MySQL", "HTML5", "CSS3", "JavaScript", "FPDF / PDF Generation"].map(tag => (
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
              "Server-side PDF generation — dynamically composing documents with custom layouts, fonts, and user data.",
              "Handling concurrent registrations safely using database transactions to prevent race conditions on limited-capacity events.",
              "Building a complete event lifecycle from creation to certificate issuance, understanding real-world workflow requirements.",
              "Email delivery integration for sending certificates directly to attendees.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-on-background text-sm leading-relaxed">
                <span className="text-accent mt-0.5 flex-shrink-0">▸</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <Link href="/#projects" className="inline-flex items-center gap-2 text-accent hover:underline text-sm">
          ← Back to Projects
        </Link>
      </div>
    </FadeIn>
  );
}