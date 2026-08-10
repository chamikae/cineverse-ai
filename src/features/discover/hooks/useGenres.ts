import { useQuery } from "@tanstack/react-query";

import { movieApi } from "@/services/tmdb";

export const genresQueryKey = ["movies", "genres"] as const;

export function useGenres() {
  return useQuery({
    queryKey: genresQueryKey,
    queryFn: movieApi.genres,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
