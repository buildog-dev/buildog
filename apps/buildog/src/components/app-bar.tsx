import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Auth } from "@/web-sdk";
import { useRouter } from "next/navigation";
const Appbar = () => {
  const route = useRouter();

  const handleLogout = () => {
    Auth.logout()
      .then(() => {
        route.push("/");
      })
      .catch((error) => {
        console.log("Logout Error", error.message);
      });
  };
  return (
    <header className="lg:px-10 border-b-2">
      <nav className="w-full flex items-center justify-end py-3">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Appbar;
