import { AlertCircle, Tv } from "lucide-react";
import type { TVShow } from "@/types/tv";

import { TVCard } from "@/components/tv/TVCard";
import {
  useAiringTodayTVShows,
  useOnTheAirTVShows,
  usePopularTVShows,
  useTopRatedTVShows,
} from "@/features/tv/hooks/useTVShows";

function TVRow({
  title,
  eyebrow,
  shows,
}: {
  title: string;
  eyebrow: string;
  shows: TVShow[];
}) {
  if (!shows || shows.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-3xl font-black">{title}</h2>

      <div className="mt-8 flex gap-5 overflow-x-auto pb-6">
        {shows.map((show) => (
          <div key={show.id} className="min-w-[170px] sm:min-w-[190px] lg:min-w-[210px]">
            <TVCard show={show} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function TVShowsPage() {
  const popularQuery = usePopularTVShows();
  const topRatedQuery = useTopRatedTVShows();
  const onAirQuery = useOnTheAirTVShows();
  const todayQuery = useAiringTodayTVShows();

  const isLoading =
    popularQuery.isLoading ||
    topRatedQuery.isLoading ||
    onAirQuery.isLoading ||
    todayQuery.isLoading;

  const isError =
    popularQuery.isError ||
    topRatedQuery.isError ||
    onAirQuery.isError ||
    todayQuery.isError;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-6 py-16">
        <div className="h-12 w-80 rounded-lg bg-white/5" />

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="aspect-[2/3] rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
          <AlertCircle className="text-red-400" />

          <h1 className="mt-4 text-2xl font-bold">TV shows couldn't be loaded.</h1>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="border-b border-white/10 bg-gradient-to-b from-red-950/20 to-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-red-400">
            <Tv size={18} />
            Television
          </div>

          <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">
            TV Shows
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/55">
            Explore popular series, shows airing now, today's releases, and top-rated
            television.
          </p>
        </div>
      </section>

      <TVRow
        eyebrow="Trending with viewers"
        title="Popular TV Shows"
        shows={popularQuery.data?.results ?? []}
      />

      <TVRow
        eyebrow="Currently broadcasting"
        title="On The Air"
        shows={onAirQuery.data?.results ?? []}
      />

      <TVRow
        eyebrow="Fresh episodes"
        title="Airing Today"
        shows={todayQuery.data?.results ?? []}
      />

      <TVRow
        eyebrow="Audience favorites"
        title="Top Rated TV"
        shows={topRatedQuery.data?.results ?? []}
      />
    </div>
  );
}
