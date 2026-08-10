import { MovieCard } from "@/components/movie/MovieCard";
import type { Movie } from "@/types/movie";

interface MovieRowProps {
  eyebrow?: string;
  title: string;
  movies: Movie[];
}

export function MovieRow({ eyebrow, title, movies }: MovieRowProps) {
  if (movies.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-7">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{title}</h2>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-6">
        {movies.map((movie) => (
          <div key={movie.id} className="min-w-[170px] sm:min-w-[190px] lg:min-w-[210px]">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
