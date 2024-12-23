"use client";

import React from "react";

import OrgNavigation from "./org-navigation";
import AvatarDropdown from "./avatar-dropdown";
import { SidebarTrigger, useSidebar } from "@ui/components/ui/sidebar";

const Appbar = () => {
  const { isMobile } = useSidebar();
  return (
    <header className="px-4 border-b">
      <nav className="w-full flex items-center py-2">
        {isMobile && <SidebarTrigger className="mr-4" />}
        <OrgNavigation />
        <div className="ml-auto">
          <AvatarDropdown />
        </div>
      </nav>
    </header>
  );
};

export default Appbar;
