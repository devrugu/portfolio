export default function ContactPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8">Get In Touch</h1>
      <p className="text-lg text-on-background mb-10">
        I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
        Feel free to reach out to me.
      </p>

      <div className="space-y-6">
        {/* Email */}
        <div className="flex items-center space-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <a
            href="mailto:your.email@example.com"
            className="text-xl text-primary hover:text-accent hover:underline transition-colors"
          >
            your.email@example.com
          </a>
        </div>

        {/* LinkedIn */}
        <div className="flex items-center space-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          <a
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-primary hover:text-accent hover:underline transition-colors"
          >
            LinkedIn Profile
          </a>
        </div>
      </div>
    </div>
  );
}