import { Star } from "lucide-react";

import { getImageUrl } from "@/services/tmdb";
import type { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const year = movie.release_date?.slice(0, 4);

  return (
    <article className="group min-w-[170px] cursor-pointer sm:min-w-[190px] lg:min-w-[210px]">
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
        {movie.poster_path ? (
          <img
            src={getImageUrl(movie.poster_path, "w500")}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/40">
            Poster unavailable
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>

      <div className="mt-3">
        <h3 className="truncate font-semibold text-white">{movie.title}</h3>

        <div className="mt-1 flex items-center gap-2 text-sm text-white/50">
          <span className="flex items-center gap-1">
            <Star size={13} className="fill-yellow-400 text-yellow-400" />

            {movie.vote_average.toFixed(1)}
          </span>

          {year && (
            <>
              <span>•</span>
              <span>{year}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
