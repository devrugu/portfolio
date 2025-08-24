import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full border-b border-gray-700/50 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary hover:text-accent transition-colors">
          Uğurcan Yılmaz
        </Link>
        <nav>
          <ul className="flex items-center space-x-6 text-sm font-medium text-on-background">
            <li><Link href="/resume" className="hover:text-accent transition-colors">Resume</Link></li>
            <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}