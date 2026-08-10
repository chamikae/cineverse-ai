import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";

import { MovieCard } from "@/components/movie/MovieCard";
import { useDiscoverMovies } from "@/features/discover/hooks/useDiscoverMovies";
import { useGenres } from "@/features/discover/hooks/useGenres";
import type { DiscoverMovieParams, MovieSortOption } from "@/types/movie";

const sortOptions: Array<{
  value: MovieSortOption;
  label: string;
}> = [
  {
    value: "popularity.desc",
    label: "Most Popular",
  },
  {
    value: "vote_average.desc",
    label: "Highest Rated",
  },
  {
    value: "primary_release_date.desc",
    label: "Newest First",
  },
  {
    value: "primary_release_date.asc",
    label: "Oldest First",
  },
];

const ratingOptions = [
  { value: 0, label: "Any rating" },
  { value: 5, label: "5+ rating" },
  { value: 6, label: "6+ rating" },
  { value: 7, label: "7+ rating" },
  { value: 8, label: "8+ rating" },
];

function DiscoverSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 15 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[2/3] rounded-2xl bg-white/5" />
          <div className="mt-3 h-5 w-3/4 rounded bg-white/5" />
          <div className="mt-2 h-4 w-1/2 rounded bg-white/5" />
        </div>
      ))}
    </div>
  );
}

export function DiscoverPage() {
  const currentYear = new Date().getFullYear();

  const years = useMemo(
    () => Array.from({ length: currentYear - 1949 }, (_, index) => currentYear - index),
    [currentYear],
  );

  const [genreId, setGenreId] = useState<number | undefined>();
  const [year, setYear] = useState<number | undefined>();
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<MovieSortOption>("popularity.desc");
  const [page, setPage] = useState(1);

  const genresQuery = useGenres();

  const filters: DiscoverMovieParams = {
    genreId,
    year,
    minRating: minRating > 0 ? minRating : undefined,
    sortBy,
    page,
  };

  const moviesQuery = useDiscoverMovies(filters);

  const genres = genresQuery.data?.genres ?? [];
  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 1, 500);

  const updateGenre = (id: number | undefined) => {
    setGenreId(id);
    setPage(1);
  };

  const resetFilters = () => {
    setGenreId(undefined);
    setYear(undefined);
    setMinRating(0);
    setSortBy("popularity.desc");
    setPage(1);
  };

  const changePage = (nextPage: number) => {
    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen">
      <section className="border-b border-white/10 bg-gradient-to-b from-red-950/20 to-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-red-400">
            <SlidersHorizontal size={17} />
            Discover
          </div>

          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Find something worth watching.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
            Explore movies by genre, release year, rating, and popularity.
          </p>
        </div>
      </section>

      <section className="sticky top-20 z-30 border-b border-white/10 bg-[#050505]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex items-center gap-2 text-sm font-bold text-white/60">
            <Filter size={16} />
            Filters
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <select
              value={year ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                setYear(value ? Number(value) : undefined);

                setPage(1);
              }}
              aria-label="Release year"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/50"
            >
              <option value="" className="bg-zinc-950">
                Any year
              </option>

              {years.map((yearOption) => (
                <option key={yearOption} value={yearOption} className="bg-zinc-950">
                  {yearOption}
                </option>
              ))}
            </select>

            <select
              value={minRating}
              onChange={(event) => {
                setMinRating(Number(event.target.value));
                setPage(1);
              }}
              aria-label="Minimum rating"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/50"
            >
              {ratingOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-zinc-950">
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value as MovieSortOption);

                setPage(1);
              }}
              aria-label="Sort movies"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/50"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-zinc-950">
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => updateGenre(undefined)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                genreId === undefined
                  ? "bg-red-500 text-white"
                  : "bg-white/5 text-white/55 hover:bg-white/10 hover:text-white"
              }`}
            >
              All genres
            </button>

            {genres.map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() => updateGenre(genre.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  genreId === genre.id
                    ? "bg-red-500 text-white"
                    : "bg-white/5 text-white/55 hover:bg-white/10 hover:text-white"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>

          {genresQuery.isError && (
            <p className="mt-4 text-sm text-amber-400">
              Genre filters are temporarily unavailable.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
              Browse
            </p>

            <h2 className="mt-2 text-3xl font-black">Movies</h2>
          </div>

          {moviesQuery.data && (
            <p className="text-sm text-white/40">
              Page {moviesQuery.data.page} of {totalPages.toLocaleString()}
            </p>
          )}
        </div>

        {moviesQuery.isLoading && <DiscoverSkeleton />}

        {moviesQuery.isError && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
            <AlertCircle className="text-red-400" />

            <h2 className="mt-4 text-2xl font-bold">We couldn't discover movies.</h2>

            <p className="mt-2 text-white/55">
              TMDb could not be reached. Please try again.
            </p>

            <button
              type="button"
              onClick={() => void moviesQuery.refetch()}
              className="mt-6 rounded-full bg-white px-5 py-3 font-semibold text-black transition hover:bg-white/90"
            >
              Try again
            </button>
          </div>
        )}

        {!moviesQuery.isLoading && !moviesQuery.isError && movies.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <h2 className="text-2xl font-black">No movies found</h2>

            <p className="mt-2 text-white/45">Try relaxing one or more filters.</p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-full bg-red-500 px-5 py-3 font-semibold transition hover:bg-red-400"
            >
              Reset filters
            </button>
          </div>
        )}

        {!moviesQuery.isError && movies.length > 0 && (
          <>
            <div
              className={`grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${
                moviesQuery.isFetching ? "opacity-60" : "opacity-100"
              } transition`}
            >
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            <div className="mt-14 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => changePage(page - 1)}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <div className="rounded-full bg-white/5 px-5 py-3 text-sm text-white/55">
                {page} / {totalPages}
              </div>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => changePage(page + 1)}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next
                <ChevronRight size={17} />
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
