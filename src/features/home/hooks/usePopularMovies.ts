import { useQuery } from "@tanstack/react-query";

import { movieApi } from "@/services/tmdb";

export const popularMoviesQueryKey = ["movies", "popular"] as const;

export function usePopularMovies() {
  return useQuery({
    queryKey: popularMoviesQueryKey,
    queryFn: movieApi.popular,
  });
}
