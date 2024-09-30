"use client";

import React from "react";

import OrgNavigation from "./org-navigation";
import AvatarDropdown from "./avatar-dropdown";

const Appbar = () => {
  return (
    <header className="px-4 border-b">
      <nav className="w-full flex items-center justify-between py-2">
        <OrgNavigation />
        <AvatarDropdown />
      </nav>
    </header>
  );
};

export default Appbar;
