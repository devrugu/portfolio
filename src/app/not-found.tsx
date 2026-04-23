import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* 404 */}
      <p className="text-8xl font-bold text-accent mb-2">404</p>
      <div className="w-16 h-0.5 bg-gray-700 mb-8" />

      <h1 className="text-2xl font-semibold text-primary mb-3">
        Page Not Found
      </h1>
      <p className="text-on-background max-w-md mb-10">
        The page you're looking for doesn't exist or has been moved.
        It might be a broken link or a typo in the URL.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/"
          className="bg-accent text-on-primary font-semibold px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/contact"
          className="border border-accent/50 text-accent font-semibold px-6 py-3 rounded-lg hover:bg-accent/10 transition-colors"
        >
          Contact Me
        </Link>
      </div>
    </div>
  );
}