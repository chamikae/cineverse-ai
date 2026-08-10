export interface PublicDomainMovie {
  itemId: string;
  title: string;
  year?: number;
}

export interface FreeMovie {
  itemId: string;
  title: string;
  description: string;
  year?: string;
  posterUrl: string | null;
  streamUrl: string | null;
  sourceUrl: string;
  rightsText: string;
}

export interface LocVideoFile {
  mimetype?: string;
  url?: string;
  download?: string;
  filename?: string;
  poster?: string | null;
  thumbnail_url?: string;
  mediaType?: string;
  rights_restricted?: boolean;
  canDownload?: boolean;
}

export interface LocResource {
  files?: unknown;
  video?: string;
  video_stream?: string;
  image?: string;
  url?: string;
  download_restricted?: boolean;
}

export interface LocItemResponse {
  item?: {
    title?: string;
    date?: string;
    description?: string | string[];
    summary?: string | string[];
    image_url?: string[];
    rights_advisory?: string | string[];
    rights_information?: string | string[];
  };

  resources?: LocResource[];
}

export interface PublicDomainMovie {
  itemId: string;
  title: string;
  year?: number;
  silentFilm?: boolean;
}

export interface FreeMovie {
  itemId: string;
  title: string;
  description: string;
  year?: string;
  posterUrl: string | null;
  streamUrl: string | null;
  sourceUrl: string;
  rightsText: string;
  silentFilm: boolean;
}
