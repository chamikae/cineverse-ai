import { AlertCircle, LoaderCircle, Search, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useMovieSearch } from "@/features/search/hooks/useMovieSearch";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getImageUrl } from "@/services/tmdb";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebouncedValue(query, 350);

  const { data, isFetching, isError, refetch } = useMovieSearch(debouncedQuery);

  const movies = data?.results ?? [];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const focusTimeout = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimeout);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const hasSearchTerm = debouncedQuery.trim().length >= 2;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search movies"
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#050505]/95 backdrop-blur-xl"
    >
      <div className="mx-auto min-h-screen max-w-7xl px-6 py-8">
        <div className="flex items-center gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5">
            <Search size={20} className="shrink-0 text-white/45" />

            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies..."
              aria-label="Search movies"
              className="h-14 w-full bg-transparent text-base text-white outline-none placeholder:text-white/35 sm:text-lg"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="shrink-0 text-white/40 transition hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
          >
            <X size={21} />
          </button>
        </div>

        {!hasSearchTerm && (
          <div className="py-24 text-center">
            <Search size={42} className="mx-auto text-white/15" />

            <h2 className="mt-5 text-2xl font-black">Find your next movie</h2>

            <p className="mt-2 text-white/45">
              Type at least two characters to start searching.
            </p>
          </div>
        )}

        {hasSearchTerm && isFetching && movies.length === 0 && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <LoaderCircle size={36} className="mx-auto animate-spin text-red-400" />

              <p className="mt-4 text-white/50">Searching CineVerse...</p>
            </div>
          </div>
        )}

        {hasSearchTerm && isError && (
          <div className="mt-12 rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
            <AlertCircle className="text-red-400" />

            <h2 className="mt-4 text-xl font-bold">Search failed.</h2>

            <p className="mt-2 text-white/50">
              We couldn't reach TMDb. Try again in a moment.
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-5 rounded-full bg-white px-5 py-3 font-semibold text-black"
            >
              Try again
            </button>
          </div>
        )}

        {hasSearchTerm && !isFetching && !isError && movies.length === 0 && (
          <div className="py-24 text-center">
            <h2 className="text-2xl font-black">No movies found</h2>

            <p className="mt-2 text-white/45">Try another title or spelling.</p>
          </div>
        )}

        {movies.length > 0 && (
          <section className="py-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
                  Search results
                </p>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  Results for "{debouncedQuery}"
                </h2>
              </div>

              {isFetching && (
                <LoaderCircle size={20} className="animate-spin text-white/40" />
              )}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {movies.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  onClick={onClose}
                  className="group min-w-0"
                >
                  <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
                    {movie.poster_path ? (
                      <img
                        src={getImageUrl(movie.poster_path, "w500")}
                        alt={movie.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center text-sm text-white/30">
                        Poster unavailable
                      </div>
                    )}
                  </div>

                  <h3 className="mt-3 truncate font-semibold transition group-hover:text-red-400">
                    {movie.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-sm text-white/45">
                    <span className="flex items-center gap-1">
                      <Star size={13} className="fill-yellow-400 text-yellow-400" />

                      {movie.vote_average.toFixed(1)}
                    </span>

                    {movie.release_date && (
                      <>
                        <span>•</span>
                        <span>{movie.release_date.slice(0, 4)}</span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
