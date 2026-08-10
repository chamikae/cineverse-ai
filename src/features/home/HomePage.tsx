import { AlertCircle, Play, Star } from "lucide-react";

import { MovieRow } from "@/components/movie/MovieRow";
import { usePopularMovies } from "@/features/home/hooks/usePopularMovies";
import { useTopRatedMovies } from "@/features/home/hooks/useTopRatedMovies";
import { useTrendingMovies } from "@/features/home/hooks/useTrendingMovies";
import { useUpcomingMovies } from "@/features/home/hooks/useUpcomingMovies";
import { getImageUrl } from "@/services/tmdb";
import { Link } from "react-router-dom";

function HomeSkeleton() {
  return (
    <div className="animate-pulse">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="h-[620px] rounded-3xl bg-white/5" />
      </section>

      {Array.from({ length: 4 }).map((_, sectionIndex) => (
        <section key={sectionIndex} className="mx-auto max-w-7xl px-6 py-10">
          <div className="h-4 w-24 rounded bg-white/5" />
          <div className="mt-3 h-9 w-64 rounded-lg bg-white/5" />

          <div className="mt-7 flex gap-5 overflow-hidden">
            {Array.from({ length: 6 }).map((_, cardIndex) => (
              <div
                key={cardIndex}
                className="aspect-[2/3] min-w-[180px] rounded-2xl bg-white/5 md:min-w-[210px]"
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function HomePage() {
  const trendingQuery = useTrendingMovies();
  const popularQuery = usePopularMovies();
  const topRatedQuery = useTopRatedMovies();
  const upcomingQuery = useUpcomingMovies();

  const isLoading =
    trendingQuery.isLoading ||
    popularQuery.isLoading ||
    topRatedQuery.isLoading ||
    upcomingQuery.isLoading;

  const isError =
    trendingQuery.isError ||
    popularQuery.isError ||
    topRatedQuery.isError ||
    upcomingQuery.isError;

  if (isLoading) {
    return <HomeSkeleton />;
  }

  if (isError) {
    const handleRetry = () => {
      void Promise.all([
        trendingQuery.refetch(),
        popularQuery.refetch(),
        topRatedQuery.refetch(),
        upcomingQuery.refetch(),
      ]);
    };

    return (
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
          <AlertCircle className="text-red-400" />

          <h1 className="mt-4 text-2xl font-bold">We couldn't load CineVerse.</h1>

          <p className="mt-2 max-w-xl text-white/60">
            Some movie data could not be loaded. Check your connection and try again.
          </p>

          <button
            type="button"
            onClick={handleRetry}
            className="mt-6 rounded-full bg-white px-5 py-3 font-semibold text-black transition hover:bg-white/90"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  const trendingMovies = trendingQuery.data?.results ?? [];
  const popularMovies = popularQuery.data?.results ?? [];
  const topRatedMovies = topRatedQuery.data?.results ?? [];
  const upcomingMovies = upcomingQuery.data?.results ?? [];

  const heroCandidates = [
    ...trendingMovies,
    ...popularMovies,
    ...topRatedMovies,
    ...upcomingMovies,
  ];

  const heroMovie =
    heroCandidates.find((movie) => movie.backdrop_path) ?? heroCandidates[0];

  if (!heroMovie) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h1 className="text-3xl font-black">No movies available right now.</h1>

        <p className="mt-3 text-white/60">Please check back again soon.</p>
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

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-end px-6 pb-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-red-400">
              Featured this week
            </p>

            <div className="mb-5 flex flex-wrap items-center gap-2 text-sm font-medium text-white/70">
              <span className="flex items-center gap-1">
                <Star size={17} className="fill-yellow-400 text-yellow-400" />

                {heroMovie.vote_average.toFixed(1)}
              </span>

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

            {heroMovie.overview && (
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
                {heroMovie.overview}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={`/movie/${heroMovie.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 font-bold transition hover:bg-red-400"
              >
                <Play size={18} fill="currentColor" />
                Explore Movie
              </Link>

              <button
                type="button"
                className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-semibold backdrop-blur-md transition hover:bg-white/15"
              >
                + Watchlist
              </button>
            </div>
          </div>
        </div>
      </section>

      <MovieRow eyebrow="This week" title="Trending Now" movies={trendingMovies} />

      <MovieRow
        eyebrow="Audience favorites"
        title="Popular Movies"
        movies={popularMovies}
      />

      <MovieRow
        eyebrow="Critically acclaimed"
        title="Top Rated"
        movies={topRatedMovies}
      />

      <MovieRow eyebrow="Coming soon" title="Upcoming Releases" movies={upcomingMovies} />
    </>
  );
}
