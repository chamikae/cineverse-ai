import axios from "axios";

import type { MovieDetails, MovieListResponse } from "@/types/movie";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

const baseURL = import.meta.env.VITE_TMDB_BASE_URL ?? "https://api.themoviedb.org/3";

export const imageBaseURL =
  import.meta.env.VITE_TMDB_IMAGE_URL ?? "https://image.tmdb.org/t/p";

if (!apiKey) {
  throw new Error(
    "Missing VITE_TMDB_API_KEY. Add it to your .env file and restart Vite.",
  );
}

export const tmdb = axios.create({
  baseURL,
  timeout: 10000,
  params: {
    api_key: apiKey,
  },
});

export function getImageUrl(path: string | null | undefined, size = "w500"): string {
  if (!path) {
    return "";
  }

  return `${imageBaseURL}/${size}${path}`;
}

export const movieApi = {
  async trending(): Promise<MovieListResponse> {
    const response = await tmdb.get<MovieListResponse>("/trending/movie/week");

    return response.data;
  },

  async popular(): Promise<MovieListResponse> {
    const response = await tmdb.get<MovieListResponse>("/movie/popular");

    return response.data;
  },

  async topRated(): Promise<MovieListResponse> {
    const response = await tmdb.get<MovieListResponse>("/movie/top_rated");

    return response.data;
  },

  async upcoming(): Promise<MovieListResponse> {
    const response = await tmdb.get<MovieListResponse>("/movie/upcoming");

    return response.data;
  },

  async search(query: string): Promise<MovieListResponse> {
    const response = await tmdb.get<MovieListResponse>("/search/movie", {
      params: {
        query,
      },
    });

    return response.data;
  },

  async details(id: string | number): Promise<MovieDetails> {
    const response = await tmdb.get<MovieDetails>(`/movie/${id}`, {
      params: {
        append_to_response: "videos,credits,similar,watch/providers",
      },
    });

    return response.data;
  },
};
