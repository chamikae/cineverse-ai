import { useQuery } from "@tanstack/react-query";

import { publicDomainMovies } from "@/data/publicDomainMovies";
import { getFreeMovie } from "@/services/loc";

export function useFreeMovie(itemId: string | undefined) {
  const movie = publicDomainMovies.find((entry) => entry.itemId === itemId);

  return useQuery({
    queryKey: ["free-movie", itemId],
    queryFn: () => {
      if (!movie) {
        throw new Error("This title is not in the verified free-movie catalog.");
      }

      return getFreeMovie(movie);
    },
    enabled: Boolean(movie),
    staleTime: 24 * 60 * 60 * 1000,
  });
}
