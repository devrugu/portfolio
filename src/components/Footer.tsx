export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-gray-700/50 py-6">
      <div className="container mx-auto flex max-w-5xl items-center justify-center px-4">
        <p className="text-sm text-gray-400">
          © {currentYear} Uğurcan Yılmaz. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}