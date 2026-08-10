import { useQuery } from "@tanstack/react-query";

import { movieApi } from "@/services/tmdb";

export const topRatedMoviesQueryKey = ["movies", "top-rated"] as const;

export function useTopRatedMovies() {
  return useQuery({
    queryKey: topRatedMoviesQueryKey,
    queryFn: movieApi.topRated,
  });
}
