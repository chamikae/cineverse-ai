import { AlertCircle, ArrowLeft, Clock, Play, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useMovieDetails } from "@/features/movie/hooks/useMovieDetails";
import { getImageUrl } from "@/services/tmdb";

function MovieDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[620px] bg-white/5" />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="h-10 w-72 rounded-lg bg-white/5" />
        <div className="mt-5 h-24 max-w-3xl rounded-xl bg-white/5" />
      </section>
    </div>
  );
}

export function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: movie, isLoading, isError, refetch } = useMovieDetails(id);

  if (isLoading) {
    return <MovieDetailsSkeleton />;
  }

  if (isError || !movie) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
          <AlertCircle className="text-red-400" />

          <h1 className="mt-4 text-2xl font-bold">We couldn't load this movie.</h1>

          <p className="mt-2 text-white/60">
            The movie may be unavailable, or TMDb could not be reached.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded-full bg-white px-5 py-3 font-semibold text-black"
            >
              Try again
            </button>

            <Link
              to="/"
              className="rounded-full border border-white/15 px-5 py-3 font-semibold"
            >
              Back home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const trailer =
    movie.videos?.results.find(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    ) ?? movie.videos?.results.find((video) => video.site === "YouTube");

  const cast = movie.credits?.cast?.slice(0, 10) ?? [];
  const similarMovies = movie.similar?.results?.slice(0, 8) ?? [];

  return (
    <>
      <section className="relative min-h-[650px] overflow-hidden">
        {movie.backdrop_path && (
          <img
            src={getImageUrl(movie.backdrop_path, "original")}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/20 to-transparent" />

        <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-end px-6 pb-16">
          <div className="max-w-4xl">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white"
            >
              <ArrowLeft size={17} />
              Back to home
            </Link>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                {movie.vote_average.toFixed(1)}
              </span>

              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}

              {movie.runtime > 0 && (
                <span className="flex items-center gap-1">
                  <Clock size={15} />
                  {movie.runtime} min
                </span>
              )}
            </div>

            <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
              {movie.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur-md"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {movie.overview && (
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
                {movie.overview}
              </p>
            )}

            {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 font-bold transition hover:bg-red-400"
              >
                <Play size={18} fill="currentColor" />
                Watch Trailer
              </a>
            )}
          </div>
        </div>
      </section>

      {cast.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
            People
          </p>

          <h2 className="mt-2 text-3xl font-black">Top Cast</h2>

          <div className="mt-8 flex gap-5 overflow-x-auto pb-6">
            {cast.map((person) => (
              <article key={person.id} className="min-w-[140px] sm:min-w-[160px]">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-white/5">
                  {person.profile_path ? (
                    <img
                      src={getImageUrl(person.profile_path, "w500")}
                      alt={person.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-3 text-center text-sm text-white/30">
                      Image unavailable
                    </div>
                  )}
                </div>

                <h3 className="mt-3 font-semibold">{person.name}</h3>

                <p className="mt-1 text-sm text-white/45">{person.character}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {similarMovies.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
            Keep exploring
          </p>

          <h2 className="mt-2 text-3xl font-black">Similar Movies</h2>

          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {similarMovies.map((similarMovie) => (
              <Link
                key={similarMovie.id}
                to={`/movie/${similarMovie.id}`}
                className="group"
              >
                <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-white/5">
                  {similarMovie.poster_path ? (
                    <img
                      src={getImageUrl(similarMovie.poster_path, "w500")}
                      alt={similarMovie.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-sm text-white/30">
                      Poster unavailable
                    </div>
                  )}
                </div>

                <h3 className="mt-3 truncate font-semibold">{similarMovie.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
