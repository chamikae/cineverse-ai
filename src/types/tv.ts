export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
}

export interface TVListResponse {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}

export interface TVGenre {
  id: number;
  name: string;
}

export interface TVSeason {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string | null;
}

export interface TVVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface TVCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TVDetails extends TVShow {
  genres: TVGenre[];
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  seasons: TVSeason[];

  videos: {
    results: TVVideo[];
  };

  credits: {
    cast: TVCastMember[];
  };

  similar: TVListResponse;
}
