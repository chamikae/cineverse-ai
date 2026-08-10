import { useQuery } from "@tanstack/react-query";

import { movieApi } from "@/services/tmdb";

export function useMovieSearch(query: string) {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: ["movies", "search", normalizedQuery],
    queryFn: () => movieApi.search(normalizedQuery),
    enabled: normalizedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}
