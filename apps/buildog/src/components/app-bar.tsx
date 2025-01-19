"use client";

import { SidebarTrigger, useSidebar } from "@ui/components/ui/sidebar";

const Appbar = () => {
  const { isMobile } = useSidebar();
  return (
    <header className="px-4 border-b">
      <nav className="w-full flex items-center py-2 min-h-[52px]">
        {isMobile && <SidebarTrigger className="mr-4" />}
      </nav>
    </header>
  );
};

export default Appbar;
