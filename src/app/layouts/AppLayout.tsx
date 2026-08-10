import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-6">
          <div className="text-2xl font-black">
            Cine<span className="text-red-500">Verse</span> AI
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
