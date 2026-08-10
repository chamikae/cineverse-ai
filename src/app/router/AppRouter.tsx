import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AppLayout } from "@/app/layouts/AppLayout";
import { HomePage } from "@/features/home/HomePage";
import { MovieDetailsPage } from "@/features/movie/MovieDetailsPage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/movie/:id",
        element: <MovieDetailsPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
