import {
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Film,
  ShieldCheck,
  VolumeX,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useFreeMovie } from "@/features/free-movies/hooks/useFreeMovie";

export function FreeMoviePage() {
  const { itemId } = useParams<{
    itemId: string;
  }>();

  const { data: movie, isLoading, isError, refetch } = useFreeMovie(itemId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-6 py-14">
        <div className="aspect-video rounded-3xl bg-white/5" />
        <div className="mt-8 h-12 w-2/3 rounded bg-white/5" />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">
        <AlertCircle className="text-red-400" />

        <h1 className="mt-4 text-2xl font-bold">This movie could not be loaded.</h1>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-full bg-white px-5 py-3 font-semibold text-black"
          >
            Try again
          </button>

          <Link
            to="/watch-free"
            className="rounded-full border border-white/10 px-5 py-3"
          >
            Back
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link
          to="/watch-free"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-white"
        >
          <ArrowLeft size={17} />
          Watch Free
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
          {movie.streamUrl ? (
            <video
              controls
              playsInline
              preload="metadata"
              poster={movie.posterUrl ?? undefined}
              className="aspect-video w-full bg-black"
            >
              <source src={movie.streamUrl} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center bg-white/5 px-6 text-center">
              <Film size={48} className="text-white/15" />

              <h2 className="mt-5 text-xl font-bold">Stream temporarily unavailable</h2>

              <p className="mt-2 text-white/45">
                The Library of Congress item loaded, but a compatible MP4 stream was not
                found.
              </p>
            </div>
          )}
        </div>
        {movie.silentFilm && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-4">
            <VolumeX size={20} className="mt-0.5 shrink-0 text-amber-300" />

            <div>
              <p className="font-semibold text-amber-200">Silent film</p>

              <p className="mt-1 text-sm leading-6 text-amber-100/60">
                This is a silent-era film. This archival playback source may not contain a
                synchronized audio track.
              </p>
            </div>
          </div>
        )}

        <div className="mt-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            <ShieldCheck size={15} />
            Public-domain collection
          </div>

          <h1 className="mt-5 text-4xl font-black sm:text-6xl">{movie.title}</h1>

          {movie.year && <p className="mt-3 text-white/45">{movie.year.slice(0, 4)}</p>}

          <p className="mt-7 text-lg leading-8 text-white/65">{movie.description}</p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
              Rights information
            </p>

            <p className="mt-3 text-sm leading-6 text-white/55">{movie.rightsText}</p>
          </div>

          <a
            href={movie.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300"
          >
            View original Library of Congress record
            <ExternalLink size={15} />
          </a>
        </div>
      </section>
    </div>
  );
}
