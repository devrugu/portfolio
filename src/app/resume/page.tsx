export default function ResumePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8">My Resume</h1>

      {/* Download Button */}
      <div className="mb-12">
        <a
          href="/placeholder-resume.pdf" // We will replace this later
          download
          className="inline-block bg-accent text-on-primary font-bold py-2 px-4 rounded-lg hover:bg-accent-hover transition-colors"
        >
          Download PDF Version
        </a>
      </div>

      {/* Summary Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold text-accent mb-4 border-b-2 border-gray-700 pb-2">Summary</h2>
        <p className="text-lg text-on-background">
          A brief, powerful summary of your professional background, skills, and career goals.
          This section should be an "elevator pitch" to capture the reader's attention.
        </p>
      </section>

      {/* Experience Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold text-accent mb-4 border-b-2 border-gray-700 pb-2">Experience</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-primary">Job Title</h3>
            <p className="text-lg font-medium text-gray-400">Company Name | City, State</p>
            <p className="text-sm text-gray-500">Month Year - Month Year</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-on-background">
              <li>Responsibility or achievement #1.</li>
              <li>Responsibility or achievement #2.</li>
              <li>Responsibility or achievement #3.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold text-accent mb-4 border-b-2 border-gray-700 pb-2">Education</h2>
        <div>
          <h3 className="text-2xl font-bold text-primary">Degree or Certificate</h3>
          <p className="text-lg font-medium text-gray-400">University or Institution Name | City, State</p>
          <p className="text-sm text-gray-500">Graduation Year</p>
        </div>
      </section>

      {/* Skills Section */}
      <section>
        <h2 className="text-3xl font-semibold text-accent mb-4 border-b-2 border-gray-700 pb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          <span className="bg-gray-700/50 text-primary text-sm font-medium px-3 py-1 rounded-full">JavaScript</span>
          <span className="bg-gray-700/50 text-primary text-sm font-medium px-3 py-1 rounded-full">React</span>
          <span className="bg-gray-700/50 text-primary text-sm font-medium px-3 py-1 rounded-full">Next.js</span>
          <span className="bg-gray-700/50 text-primary text-sm font-medium px-3 py-1 rounded-full">Node.js</span>
          <span className="bg-gray-700/50 text-primary text-sm font-medium px-3 py-1 rounded-full">Tailwind CSS</span>
        </div>
      </section>
    </div>
  );
}