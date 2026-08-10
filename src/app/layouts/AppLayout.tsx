import { Outlet } from "react-router-dom";

import { Navbar } from "@/components/layout/Navbar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
