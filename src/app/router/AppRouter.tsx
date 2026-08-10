import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AppLayout } from "@/app/layouts/AppLayout";
import { DiscoverPage } from "@/features/discover/DiscoverPage";
import { FreeMoviePage } from "@/features/free-movies/FreeMoviePage";
import { WatchFreePage } from "@/features/free-movies/WatchFreePage";
import { HomePage } from "@/features/home/HomePage";
import { MovieDetailsPage } from "@/features/movie/MovieDetailsPage";
import { TVDetailsPage } from "@/features/tv/TVDetailsPage";
import { TVShowsPage } from "@/features/tv/TVShowsPage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/discover",
        element: <DiscoverPage />,
      },
      {
        path: "/movie/:id",
        element: <MovieDetailsPage />,
      },
      {
        path: "/watch-free",
        element: <WatchFreePage />,
      },
      {
        path: "/watch-free/:itemId",
        element: <FreeMoviePage />,
      },
      {
        path: "/tv",
        element: <TVShowsPage />,
      },
      {
        path: "/tv/:id",
        element: <TVDetailsPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
