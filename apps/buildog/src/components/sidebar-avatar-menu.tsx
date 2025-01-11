"use client";

import { SignOut, CaretUpDown, Sun, Gear, Moon } from "@ui/components/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { Skeleton } from "@ui/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@ui/components/ui/sidebar";
import { Auth } from "@/web-sdk";
import { useAuth } from "@/components/auth-provider";
import { useTheme } from "next-themes";
import { Switch } from "@ui/components/ui/switch";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SidebarAvatarMenu() {
  const { isMobile } = useSidebar();
  const { userCredentials, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    Auth.signOut();
  };

  useEffect(() => {
    if (!loading && !userCredentials) {
      router.push("/login"); // Automatically redirect
    }
  }, [loading, userCredentials, router]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex w-full items-center gap-3 rounded-lg p-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-4 w-4" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {userCredentials?.first_name} {userCredentials?.last_name}
                </span>
                <span className="truncate text-xs">{userCredentials?.email}</span>
              </div>
              <CaretUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {userCredentials?.first_name} {userCredentials?.last_name}
                  </span>
                  <span className="truncate text-xs">{userCredentials?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-medium">Preferences</DropdownMenuLabel>
              <div className="flex items-center justify-between px-2 py-2 hover:bg-transparent">
                <span className="text-sm">Theme</span>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <Switch
                    id="theme-toggle"
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                  />
                  <Moon className="h-4 w-4" />
                </div>
              </div>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/account/settings" className="flex items-center">
                  <Gear className="mr-1" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 hover:bg-red-500 dark:hover:bg-red-900/50 dark:bg-transparent"
                onClick={handleLogout}
              >
                <SignOut className="mr-1" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
