import { useQuery } from "@tanstack/react-query";

import { movieApi } from "@/services/tmdb";

export const trendingMoviesQueryKey = ["movies", "trending", "week"] as const;

export function useTrendingMovies() {
  return useQuery({
    queryKey: trendingMoviesQueryKey,
    queryFn: movieApi.trending,
  });
}
