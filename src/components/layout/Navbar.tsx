import { Film, Search } from "lucide-react";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3" aria-label="CineVerse AI home">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500">
            <Film size={20} />
          </div>

          <span className="text-xl font-black tracking-tight sm:text-2xl">
            Cine<span className="text-red-500">Verse</span> AI
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-white/60 md:flex">
          <Link to="/" className="transition hover:text-white">
            Home
          </Link>

          <span className="cursor-not-allowed text-white/25">Discover</span>

          <span className="cursor-not-allowed text-white/25">Watchlist</span>
        </nav>

        <button
          type="button"
          disabled
          aria-label="Search coming soon"
          title="Search coming soon"
          className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/35"
        >
          <Search size={18} />
        </button>
      </div>
    </header>
  );
}
