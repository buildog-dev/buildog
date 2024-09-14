"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@ui/components/ui/dropdown-menu";
import { ExitIcon, GearIcon } from "@ui/components/react-icons";
import { Auth } from "@/web-sdk";
import OrgNavigation from "./org-navigation";

const Appbar = () => {
  const handleLogout = () => {
    Auth.signOut();
  };

  return (
    <header className="px-4 border-b">
      <nav className="w-full flex items-center justify-between py-2">
        <OrgNavigation />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[200px]">
            <Link href="/account/settings">
              <DropdownMenuItem className="cursor-pointer">
                <GearIcon className="mr-1 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
              <ExitIcon className="mr-1 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Appbar;
