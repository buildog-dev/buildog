"use client";

import React from "react";

import OrgNavigation from "./org-navigation";
import AvatarDropdown from "./avatar-dropdown";
import { SidebarTrigger } from "@ui/components/ui/sidebar";

const Appbar = () => {
  return (
    <header className="px-4 border-b">
      <nav className="w-full flex items-center py-2">
        <SidebarTrigger className="mr-4" />
        <OrgNavigation />
        <div className="ml-auto">
          <AvatarDropdown />
        </div>
      </nav>
    </header>
  );
};

export default Appbar;
