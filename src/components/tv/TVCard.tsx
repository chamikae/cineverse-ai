import { Star } from "lucide-react";
import { Link } from "react-router-dom";

import { getImageUrl } from "@/services/tmdb";
import type { TVShow } from "@/types/tv";

interface TVCardProps {
  show: TVShow;
}

export function TVCard({ show }: TVCardProps) {
  const year = show.first_air_date?.slice(0, 4);

  return (
    <Link to={`/tv/${show.id}`} className="group block min-w-0">
      <article>
        <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
          {show.poster_path ? (
            <img
              src={getImageUrl(show.poster_path, "w500")}
              alt={show.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-white/35">
              Poster unavailable
            </div>
          )}
        </div>

        <h3 className="mt-3 truncate font-semibold transition group-hover:text-red-400">
          {show.name}
        </h3>

        <div className="mt-1 flex items-center gap-2 text-sm text-white/45">
          <span className="flex items-center gap-1">
            <Star size={13} className="fill-yellow-400 text-yellow-400" />

            {show.vote_average.toFixed(1)}
          </span>

          {year && (
            <>
              <span>•</span>
              <span>{year}</span>
            </>
          )}
        </div>
      </article>
    </Link>
  );
}
