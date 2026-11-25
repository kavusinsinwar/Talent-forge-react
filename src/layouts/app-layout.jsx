import React from "react";
import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] transition-colors">
      {/* Sticky Top Navigation (56px) */}
      <Header />

      {/* Main Page Canvas (Max 1128px container) */}
      <main className="flex-1 w-full max-w-[1128px] mx-auto px-4 py-4 pb-20 md:pb-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
