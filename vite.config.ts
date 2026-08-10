import { fileURLToPath, URL } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

type NextFunction = () => void;

async function handleLocApiRequest(
  request: IncomingMessage,
  response: ServerResponse,
  next: NextFunction,
) {
  const requestUrl = request.url ?? "";

  const pathname = requestUrl.split("?")[0];

  const match = pathname.match(/^\/loc-api\/item\/([A-Za-z0-9_-]+)\/?$/);

  if (!match) {
    next();
    return;
  }

  const itemId = match[1];

  try {
    const locUrl =
      `https://www.loc.gov/item/` +
      `${encodeURIComponent(itemId)}/` +
      `?fo=json&at=item,resources`;

    const locResponse = await fetch(locUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        Accept: "application/json",
        "User-Agent": "CineVerseAI/1.0",
      },
    });

    if (!locResponse.ok) {
      response.statusCode = 502;
      response.setHeader("Content-Type", "application/json; charset=utf-8");

      response.end(
        JSON.stringify({
          error: "Library of Congress request failed.",
          upstreamStatus: locResponse.status,
        }),
      );

      return;
    }

    const contentType = locResponse.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      response.statusCode = 502;
      response.setHeader("Content-Type", "application/json; charset=utf-8");

      response.end(
        JSON.stringify({
          error: "Library of Congress returned a non-JSON response.",
        }),
      );

      return;
    }

    const body = await locResponse.text();

    response.statusCode = 200;

    response.setHeader("Content-Type", "application/json; charset=utf-8");

    response.setHeader("Cache-Control", "public, max-age=3600");

    response.end(body);
  } catch (error) {
    console.error("Library of Congress API error:", error);

    response.statusCode = 502;

    response.setHeader("Content-Type", "application/json; charset=utf-8");

    response.end(
      JSON.stringify({
        error: "Unable to communicate with the Library of Congress.",
      }),
    );
  }
}

function locApiPlugin(): Plugin {
  return {
    name: "cineverse-loc-api",

    configureServer(server) {
      server.middlewares.use(handleLocApiRequest);
    },

    configurePreviewServer(server) {
      server.middlewares.use(handleLocApiRequest);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), locApiPlugin()],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
