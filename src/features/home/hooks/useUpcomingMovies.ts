import { useQuery } from "@tanstack/react-query";

import { movieApi } from "@/services/tmdb";

export const upcomingMoviesQueryKey = ["movies", "upcoming"] as const;

export function useUpcomingMovies() {
  return useQuery({
    queryKey: upcomingMoviesQueryKey,
    queryFn: movieApi.upcoming,
  });
}
