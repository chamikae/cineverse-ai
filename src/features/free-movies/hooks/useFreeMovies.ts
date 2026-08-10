import { useQuery } from "@tanstack/react-query";

import { publicDomainMovies } from "@/data/publicDomainMovies";
import { getFreeMovie } from "@/services/loc";
import type { FreeMovie } from "@/types/freeMovie";

export function useFreeMovies() {
  return useQuery({
    queryKey: ["free-movies", "library-of-congress"],

    queryFn: async (): Promise<FreeMovie[]> => {
      const results = await Promise.allSettled(
        publicDomainMovies.map((movie) => getFreeMovie(movie)),
      );

      const successfulMovies = results.flatMap((result) =>
        result.status === "fulfilled" ? [result.value] : [],
      );

      if (successfulMovies.length === 0) {
        throw new Error("No Library of Congress movies could be loaded.");
      }

      return successfulMovies;
    },

    staleTime: 24 * 60 * 60 * 1000,
  });
}
