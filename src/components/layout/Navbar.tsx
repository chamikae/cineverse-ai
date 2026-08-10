import { Film, Search } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { SearchOverlay } from "@/components/search/SearchOverlay";

function getNavClass({ isActive }: { isActive: boolean }) {
  return isActive ? "text-white" : "text-white/50 transition hover:text-white";
}

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3" aria-label="CineVerse AI home">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500">
              <Film size={20} />
            </div>

            <span className="text-xl font-black tracking-tight sm:text-2xl">
              Cine
              <span className="text-red-500">Verse</span> AI
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
            <NavLink to="/" end className={getNavClass}>
              Home
            </NavLink>

            <NavLink to="/discover" className={getNavClass}>
              Discover
            </NavLink>

            <span
              title="Watchlist coming soon"
              className="cursor-not-allowed text-white/20"
            >
              Watchlist
            </span>
          </nav>

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search movies"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
          >
            <Search size={18} />
          </button>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
