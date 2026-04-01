import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">BG</span>
          </div>
          <span className="font-semibold text-gray-900 text-lg">
            BG Remover
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/pricing"
            className="text-gray-500 hover:text-gray-900 transition-colors text-sm"
          >
            Pricing
          </Link>
          <Link
            href="/api"
            className="text-gray-500 hover:text-gray-900 transition-colors text-sm"
          >
            API
          </Link>
          <a
            href="https://github.com/hetianxing668/image-background-remover"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-900 transition-colors text-sm"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
