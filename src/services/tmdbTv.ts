import { tmdb } from "@/services/tmdb";
import type { TVDetails, TVListResponse } from "@/types/tv";

export const tvApi = {
  async popular(): Promise<TVListResponse> {
    const response = await tmdb.get<TVListResponse>("/tv/popular");

    return response.data;
  },

  async topRated(): Promise<TVListResponse> {
    const response = await tmdb.get<TVListResponse>("/tv/top_rated");

    return response.data;
  },

  async onTheAir(): Promise<TVListResponse> {
    const response = await tmdb.get<TVListResponse>("/tv/on_the_air");

    return response.data;
  },

  async airingToday(): Promise<TVListResponse> {
    const response = await tmdb.get<TVListResponse>("/tv/airing_today");

    return response.data;
  },

  async details(id: string | number): Promise<TVDetails> {
    const response = await tmdb.get<TVDetails>(`/tv/${id}`, {
      params: {
        append_to_response: "videos,credits,similar,watch/providers",
      },
    });

    return response.data;
  },
};
