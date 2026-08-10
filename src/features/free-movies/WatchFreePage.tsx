import { AlertCircle, Film, Play, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { useFreeMovies } from "@/features/free-movies/hooks/useFreeMovies";

function LoadingGrid() {
  return (
    <div className="grid animate-pulse grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[2/3] rounded-2xl bg-white/5" />
          <div className="mt-3 h-5 rounded bg-white/5" />
        </div>
      ))}
    </div>
  );
}

export function WatchFreePage() {
  const { data: movies, isLoading, isError, refetch } = useFreeMovies();

  return (
    <div className="min-h-screen">
      <section className="border-b border-white/10 bg-gradient-to-b from-red-950/25 to-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-red-400">
            <Film size={17} />
            Watch Free
          </div>

          <h1 className="mt-4 max-w-4xl text-4xl font-black sm:text-6xl">
            Full movies. Legally free.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/55">
            Watch verified public-domain films supplied by the Library of Congress.
          </p>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            <ShieldCheck size={16} />
            Verified free-to-use catalog
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        {isLoading && <LoadingGrid />}

        {isError && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
            <AlertCircle className="text-red-400" />

            <h2 className="mt-4 text-2xl font-bold">Free movies couldn't be loaded.</h2>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-6 rounded-full bg-white px-5 py-3 font-semibold text-black"
            >
              Try again
            </button>
          </div>
        )}

        {movies && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {movies.map((movie) => (
              <Link
                key={movie.itemId}
                to={`/watch-free/${movie.itemId}`}
                className="group"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Film className="text-white/15" size={48} />
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition group-hover:opacity-100">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500">
                      <Play size={22} fill="currentColor" />
                    </div>
                  </div>
                </div>

                <h2 className="mt-3 font-bold group-hover:text-red-400">{movie.title}</h2>

                {movie.year && (
                  <p className="mt-1 text-sm text-white/40">{movie.year.slice(0, 4)}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
