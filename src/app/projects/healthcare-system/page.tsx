import RelatedProjects from "@/components/RelatedProjects";
import ProjectViewCounter from "@/components/ProjectViewCounter";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

const features = [
  { icon: "👤", title: "Patient Management", desc: "Register, update, and search patient records with full medical history tracking." },
  { icon: "📅", title: "Appointment Scheduling", desc: "Book, reschedule, and cancel appointments with conflict detection." },
  { icon: "👨‍⚕️", title: "Doctor Dashboard", desc: "Doctors can view their daily schedule, patient notes, and prescription history." },
  { icon: "🔐", title: "Role-Based Access", desc: "Separate access levels for admins, doctors, and receptionists." },
  { icon: "💊", title: "Prescription Records", desc: "Create and store digital prescriptions linked to appointments." },
  { icon: "📊", title: "Reporting", desc: "Generate reports on appointments, patient visits, and department activity." },
];

export default function HealthcareSystemPage() {
  return (
    <FadeIn>
      <div className="max-w-3xl">

        {/* Header */}
        <div className="flex items-start justify-between mb-2 gap-4">
          <h1 className="text-4xl font-bold text-primary">Healthcare Management System</h1>
          <a
            href="https://github.com/devrugu/healthcare-management-system"
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
          <p className="text-accent font-medium">Full-Stack Web Application · PHP · MySQL</p>
          <ProjectViewCounter slug="healthcare-system" />
        </div>

        {/* Overview */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">Overview</h2>
          <p className="text-on-background leading-relaxed mb-4">
            A full-stack web application for managing hospital operations — built with a classic
            <span className="text-accent font-medium"> LAMP stack</span> (Linux, Apache, MySQL, PHP).
            The system handles patient records, doctor schedules, appointment booking, and prescription
            management through a role-based access control system.
          </p>
          <p className="text-on-background leading-relaxed">
            This was a university capstone-level project that required designing a normalized relational
            database, implementing secure authentication, and building a complete CRUD interface for
            multiple user roles — all from scratch without any modern frameworks.
          </p>
        </section>

        {/* Features */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="text-primary font-semibold mb-1 text-sm">{f.title}</h3>
                <p className="text-on-background text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">Architecture</h2>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-3">
            {[
              { label: "Frontend", value: "HTML5, CSS3, vanilla JavaScript for dynamic interactions" },
              { label: "Backend", value: "PHP 8 with MVC-inspired structure, session-based auth" },
              { label: "Database", value: "MySQL with normalized schema — patients, doctors, appointments, prescriptions" },
              { label: "Security", value: "Prepared statements for SQL injection prevention, password hashing" },
            ].map(row => (
              <div key={row.label} className="flex gap-4 text-sm">
                <span className="text-accent font-semibold w-24 flex-shrink-0">{row.label}</span>
                <span className="text-on-background">{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {["PHP 8", "MySQL", "HTML5", "CSS3", "JavaScript", "Apache", "LAMP Stack"].map(tag => (
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
              "Designed a fully normalized relational database schema from scratch, learning the importance of foreign keys, indexing, and avoiding data anomalies.",
              "Implemented role-based access control (RBAC) without any framework, deepening understanding of session management and authorization logic.",
              "Learned SQL injection prevention through prepared statements and the importance of input validation on both client and server side.",
              "Understood the full request-response lifecycle of a web application at a low level — invaluable for understanding modern frameworks later.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-on-background text-sm leading-relaxed">
                <span className="text-accent mt-0.5 flex-shrink-0">▸</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <RelatedProjects currentSlug="healthcare-system" />

        <div className="mt-10">
          <Link href="/#projects" className="inline-flex items-center gap-2 text-accent hover:underline text-sm">
            ← Back to Projects
          </Link>
        </div>
      </div>
    </FadeIn>
  );
}