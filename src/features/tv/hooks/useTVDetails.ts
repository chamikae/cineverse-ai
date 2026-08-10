import { useQuery } from "@tanstack/react-query";

import { tvApi } from "@/services/tmdbTv";

export function useTVDetails(showId: string | undefined) {
  return useQuery({
    queryKey: ["tv", "details", showId],

    queryFn: () => {
      if (!showId) {
        throw new Error("TV show ID is required.");
      }

      return tvApi.details(showId);
    },

    enabled: Boolean(showId),
  });
}
