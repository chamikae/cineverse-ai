import { useQuery } from "@tanstack/react-query";

import { tvApi } from "@/services/tmdbTv";

export function usePopularTVShows() {
  return useQuery({
    queryKey: ["tv", "popular"],
    queryFn: tvApi.popular,
  });
}

export function useTopRatedTVShows() {
  return useQuery({
    queryKey: ["tv", "top-rated"],
    queryFn: tvApi.topRated,
  });
}

export function useOnTheAirTVShows() {
  return useQuery({
    queryKey: ["tv", "on-the-air"],
    queryFn: tvApi.onTheAir,
  });
}

export function useAiringTodayTVShows() {
  return useQuery({
    queryKey: ["tv", "airing-today"],
    queryFn: tvApi.airingToday,
  });
}
