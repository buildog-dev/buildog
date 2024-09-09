"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { DashboardIcon } from "@ui/components/ui/react-icons"; // Importing the Home icon from your icon library
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Auth } from "@/web-sdk";

const Appbar = ({ organizations, currentOrganization }) => {
  const router = useRouter();

  const handleLogout = () => {
    Auth.signOut();
  };

  const handleOrganizationChange = (organizationId) => {
    router.push(`/organizations/${organizationId}`);
  };

  const goToOrganizationsHome = () => {
    router.push("/organizations");
  };

  return (
    <header className="px-4 border-b">
      <nav className="w-full flex items-center justify-between py-2">
        <div className="flex items-center">
          <button
            onClick={goToOrganizationsHome}
            className="p-2 mr-5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Go to organizations"
          >
            <DashboardIcon className="w-6 h-6 text-black dark:text-white" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="text-lg font-semibold cursor-pointer bg-primary text-white dark:bg-white dark:text-black hover:bg-primary/90 dark:hover:bg-gray-200 py-2 px-4 rounded-md transition-colors duration-200"
                aria-label="Select organization"
              >
                {currentOrganization?.name ?? "Select Organization"}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="min-w-[200px]">
              {organizations.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleOrganizationChange(org.id)}
                  className={`cursor-pointer ${
                    org.id === currentOrganization?.id ? "font-bold" : ""
                  }`}
                >
                  {org.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[200px]">
            <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Appbar;
