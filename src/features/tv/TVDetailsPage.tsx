import { AlertCircle, ArrowLeft, Calendar, Play, Star, Tv } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { TVCard } from "@/components/tv/TVCard";
import { useTVDetails } from "@/features/tv/hooks/useTVDetails";
import { getImageUrl } from "@/services/tmdb";

export function TVDetailsPage() {
  const { id } = useParams<{
    id: string;
  }>();

  const { data: show, isLoading, isError } = useTVDetails(id);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-[650px] bg-white/5" />
      </div>
    );
  }

  if (isError || !show) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-24">
        <AlertCircle className="text-red-400" />

        <h1 className="mt-4 text-2xl font-bold">This TV show couldn't be loaded.</h1>
      </section>
    );
  }

  const trailer =
    show.videos?.results.find(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    ) ?? show.videos?.results.find((video) => video.site === "YouTube");

  const cast = show.credits?.cast?.slice(0, 10) ?? [];

  const similarShows = show.similar?.results?.slice(0, 8) ?? [];

  return (
    <>
      <section className="relative min-h-[650px] overflow-hidden">
        {show.backdrop_path && (
          <img
            src={getImageUrl(show.backdrop_path, "original")}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-end px-6 pb-16">
          <div className="max-w-4xl">
            <Link
              to="/tv"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 hover:text-white"
            >
              <ArrowLeft size={17} />
              Back to TV Shows
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/65">
              <span className="flex items-center gap-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />

                {show.vote_average.toFixed(1)}
              </span>

              {show.first_air_date && (
                <span className="flex items-center gap-1">
                  <Calendar size={15} />
                  {show.first_air_date.slice(0, 4)}
                </span>
              )}

              <span className="flex items-center gap-1">
                <Tv size={15} />
                {show.number_of_seasons} seasons
              </span>

              <span>{show.number_of_episodes} episodes</span>
            </div>

            <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
              {show.name}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2">
              {show.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {show.overview && (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
                {show.overview}
              </p>
            )}

            {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 font-bold hover:bg-red-400"
              >
                <Play size={18} fill="currentColor" />
                Watch Trailer
              </a>
            )}
          </div>
        </div>
      </section>

      {show.seasons.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
            Episodes
          </p>

          <h2 className="mt-2 text-3xl font-black">Seasons</h2>

          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {show.seasons.map((season) => (
              <article key={season.id}>
                <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-white/5">
                  {season.poster_path ? (
                    <img
                      src={getImageUrl(season.poster_path, "w500")}
                      alt={season.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/25">
                      No poster
                    </div>
                  )}
                </div>

                <h3 className="mt-3 font-bold">{season.name}</h3>

                <p className="mt-1 text-sm text-white/45">
                  {season.episode_count} episodes
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {cast.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="text-3xl font-black">Top Cast</h2>

          <div className="mt-8 flex gap-5 overflow-x-auto pb-6">
            {cast.map((person) => (
              <article key={person.id} className="min-w-[150px]">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-white/5">
                  {person.profile_path ? (
                    <img
                      src={getImageUrl(person.profile_path, "w500")}
                      alt={person.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <h3 className="mt-3 font-semibold">{person.name}</h3>

                <p className="mt-1 text-sm text-white/45">{person.character}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {similarShows.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="text-3xl font-black">Similar Shows</h2>

          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {similarShows.map((similarShow) => (
              <TVCard key={similarShow.id} show={similarShow} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
