import { AlertCircle, Play, Star } from "lucide-react";

import { useTrendingMovies } from "@/features/home/hooks/useTrendingMovies";
import { getImageUrl } from "@/services/tmdb";

function HomeSkeleton() {
  return (
    <section className="mx-auto max-w-7xl animate-pulse px-6 py-16">
      <div className="h-[420px] rounded-3xl bg-white/5" />

      <div className="mt-8 h-10 w-72 rounded-xl bg-white/5" />

      <div className="mt-6 flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-[280px] min-w-[185px] rounded-2xl bg-white/5" />
        ))}
      </div>
    </section>
  );
}

export function HomePage() {
  const { data, isLoading, isError, refetch } = useTrendingMovies();

  if (isLoading) {
    return <HomeSkeleton />;
  }

  if (isError) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
          <AlertCircle className="text-red-400" />

          <h1 className="mt-4 text-2xl font-bold">We couldn't load movies.</h1>

          <p className="mt-2 text-white/60">
            Check your internet connection and TMDb configuration.
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-6 rounded-full bg-white px-5 py-3 font-semibold text-black transition hover:bg-white/90"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  const movies = data?.results ?? [];

  const heroMovie = movies.find((movie) => movie.backdrop_path) ?? movies[0];

  if (!heroMovie) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h1 className="text-3xl font-black">Nothing trending right now.</h1>

        <p className="mt-3 text-white/60">Check back again soon.</p>
      </section>
    );
  }

  return (
    <>
      <section className="relative min-h-[680px] overflow-hidden">
        {heroMovie.backdrop_path && (
          <img
            src={getImageUrl(heroMovie.backdrop_path, "original")}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20" />

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-end px-6 pb-20">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-2 text-sm font-medium text-white/70">
              <Star size={17} className="fill-yellow-400 text-yellow-400" />

              <span>{heroMovie.vote_average.toFixed(1)}</span>

              {heroMovie.release_date && (
                <>
                  <span>•</span>

                  <span>{heroMovie.release_date.slice(0, 4)}</span>
                </>
              )}
            </div>

            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              {heroMovie.title}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
              {heroMovie.overview}
            </p>

            <button
              type="button"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 font-bold transition hover:bg-red-400"
            >
              <Play size={18} fill="currentColor" />
              Explore Movie
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-400">
            This week
          </p>

          <h2 className="mt-2 text-3xl font-black">Trending Now</h2>
        </div>

        <div className="mt-8 flex gap-5 overflow-x-auto pb-6">
          {movies.map((movie) => (
            <article key={movie.id} className="group min-w-[180px] md:min-w-[210px]">
              <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-white/5">
                {movie.poster_path ? (
                  <img
                    src={getImageUrl(movie.poster_path, "w500")}
                    alt={movie.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center text-sm text-white/40">
                    Poster unavailable
                  </div>
                )}
              </div>

              <h3 className="mt-3 truncate font-bold">{movie.title}</h3>

              <p className="mt-1 text-sm text-white/50">
                ⭐ {movie.vote_average.toFixed(1)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
