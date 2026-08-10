import { useQuery } from "@tanstack/react-query";

import { movieApi } from "@/services/tmdb";

export function useMovieDetails(movieId: string | undefined) {
  return useQuery({
    queryKey: ["movies", "details", movieId],
    queryFn: () => {
      if (!movieId) {
        throw new Error("Movie ID is required.");
      }

      return movieApi.details(movieId);
    },
    enabled: Boolean(movieId),
  });
}
