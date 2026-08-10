import { useQuery } from "@tanstack/react-query";

import { movieApi } from "@/services/tmdb";
import type { DiscoverMovieParams } from "@/types/movie";

export function useDiscoverMovies(filters: DiscoverMovieParams) {
  return useQuery({
    queryKey: ["movies", "discover", filters],
    queryFn: () => movieApi.discover(filters),
    placeholderData: (previousData) => previousData,
  });
}
