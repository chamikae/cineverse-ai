import axios from "axios";

import type {
  FreeMovie,
  LocItemResponse,
  LocResource,
  LocVideoFile,
  PublicDomainMovie,
} from "@/types/freeMovie";

const locApi = axios.create({
  baseURL: "/loc-api",
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

function normalizeUrl(url: string | undefined): string | null {
  if (!url) {
    return null;
  }

  if (url.startsWith("//")) {
    return `https:${url}`;
  }

  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }

  return url;
}

function toStringValue(value: string | string[] | undefined): string {
  if (!value) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.join(" ");
  }

  return value;
}

function flattenFiles(value: unknown): LocVideoFile[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => flattenFiles(entry));
  }

  if (typeof value === "object") {
    return [value as LocVideoFile];
  }

  return [];
}

function isMp4Url(url: string | null): url is string {
  if (!url) {
    return false;
  }

  return url.toLowerCase().includes(".mp4");
}

function findMp4FromResource(resource: LocResource): string | null {
  if (resource.download_restricted) {
    return null;
  }

  /*
   * IMPORTANT:
   *
   * Prefer LOC's direct MP4 URL.
   *
   * Do NOT prefer video_stream here because that can
   * contain an HLS .m3u8 playlist.
   */
  const directVideo = normalizeUrl(resource.video);

  if (isMp4Url(directVideo)) {
    return directVideo;
  }

  const files = flattenFiles(resource.files);

  const unrestrictedFiles = files.filter(
    (file) => file.rights_restricted !== true && file.canDownload !== false,
  );

  /*
   * First choice:
   * explicitly declared video/mp4.
   */
  const typedMp4 = unrestrictedFiles.find(
    (file) =>
      file.mimetype === "video/mp4" &&
      Boolean(file.download ?? file.url ?? file.filename),
  );

  if (typedMp4) {
    const url =
      normalizeUrl(typedMp4.download) ??
      normalizeUrl(typedMp4.url) ??
      normalizeUrl(typedMp4.filename);

    if (isMp4Url(url)) {
      return url;
    }
  }

  /*
   * Some LOC entries call video files
   * application/x-video instead of video/mp4.
   *
   * Therefore also detect MP4 from filename/URL.
   */
  const mp4ByExtension = unrestrictedFiles.find((file) => {
    const candidate = file.download ?? file.url ?? file.filename ?? "";

    return candidate.toLowerCase().includes(".mp4");
  });

  if (mp4ByExtension) {
    const url =
      normalizeUrl(mp4ByExtension.download) ??
      normalizeUrl(mp4ByExtension.url) ??
      normalizeUrl(mp4ByExtension.filename);

    if (isMp4Url(url)) {
      return url;
    }
  }

  /*
   * Don't return resource.video_stream here.
   *
   * video_stream can be .m3u8.
   * We'll add proper HLS support separately later.
   */
  return null;
}

function findPoster(response: LocItemResponse): string | null {
  const resources = response.resources ?? [];

  for (const resource of resources) {
    const files = flattenFiles(resource.files);

    const poster = files.find(
      (file) => Boolean(file.poster) || Boolean(file.thumbnail_url),
    );

    const posterUrl =
      normalizeUrl(poster?.poster ?? undefined) ?? normalizeUrl(poster?.thumbnail_url);

    if (posterUrl) {
      return posterUrl;
    }

    const resourceImage = normalizeUrl(resource.image);

    if (resourceImage) {
      return resourceImage;
    }
  }

  return normalizeUrl(response.item?.image_url?.at(-1));
}

export async function getFreeMovie(movie: PublicDomainMovie): Promise<FreeMovie> {
  const response = await locApi.get<LocItemResponse>(`/item/${movie.itemId}`);

  const data = response.data;

  const resources = data.resources ?? [];

  const streamUrl =
    resources
      .map((resource) => findMp4FromResource(resource))
      .find((url): url is string => Boolean(url)) ?? null;

  const description =
    toStringValue(data.item?.summary) ||
    toStringValue(data.item?.description) ||
    "Public-domain motion picture from the Library of Congress.";

  const rightsText =
    toStringValue(data.item?.rights_advisory) ||
    toStringValue(data.item?.rights_information) ||
    "Public-domain selection from the Library of Congress Free to Use and Reuse collection.";

  return {
    itemId: movie.itemId,
    title: data.item?.title ?? movie.title,
    description,
    year: data.item?.date ?? movie.year?.toString(),
    posterUrl: findPoster(data),
    streamUrl,
    sourceUrl: `https://www.loc.gov/item/${movie.itemId}/`,
    rightsText,
    silentFilm: movie.silentFilm ?? false,
  };
}
