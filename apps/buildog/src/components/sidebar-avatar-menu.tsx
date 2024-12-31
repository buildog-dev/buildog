import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import {
  SignOut,
  Gear,
  CaretUpDown,
  FadersHorizontal,
  Sun,
  Moon,
} from "@ui/components/react-icons";
import { Auth } from "@/web-sdk";
import { useAuth } from "@/components/auth-provider";
import { useSidebar } from "@ui/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { useTheme } from "next-themes";
import { Switch } from "@ui/components/ui/switch";
import { Label } from "@ui/components/ui/label";
import { Skeleton } from "@ui/components/skeleton";
import { cn } from "@ui/lib/utils";

export default function SidebarAvatarMenu() {
  const { userCredentials, loading } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    Auth.signOut();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "outline-none rounded-lg w-full h-12",
          !collapsed && "hover:bg-zinc-100 dark:hover:bg-zinc-800"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg",
            collapsed ? "w-full justify-start pl-0" : "pl-0"
          )}
        >
          {loading ? (
            <Skeleton className="h-8 w-8 rounded-full animate-pulse" />
          ) : (
            <Avatar className="h-8 w-8 p-1">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          )}
          {!collapsed &&
            (loading ? (
              <div className="flex flex-col items-start text-sm space-y-1">
                <Skeleton className="h-4 w-24 animate-pulse" />
                <Skeleton className="h-3 w-16 animate-pulse" />
              </div>
            ) : (
              <>
                <div className="flex flex-col items-start text-sm min-w-0 flex-1">
                  <span className="font-medium">
                    {userCredentials.first_name} {userCredentials.last_name}
                  </span>
                  <span className="text-zinc-500 text-xs">{userCredentials.email}</span>
                </div>
                <CaretUpDown className="h-4 w-4 ml-auto mr-2" />
              </>
            ))}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[240px] p-2 space-y-2">
        {collapsed && loading && (
          <div className="mb-2 px-2 py-1.5">
            <Skeleton className="h-4 w-24 animate-pulse" />
            <Skeleton className="h-3 w-16 animate-pulse" />
          </div>
        )}
        {collapsed && !loading && (
          <div className="mb-2 px-2 py-1.5">
            <div className="font-medium">
              {userCredentials.first_name} {userCredentials.last_name}
            </div>
            <div className="text-zinc-500 text-xs">{userCredentials.email}</div>
          </div>
        )}
        <Link href="/account/settings" className="block">
          <div className="flex items-center px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
            <Gear className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </div>
        </Link>
        <div
          className="flex items-center px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer text-red-500"
          onClick={handleLogout}
        >
          <SignOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </div>
        <DropdownMenuSeparator />
        <div className="flex items-center px-2 py-1.5 cursor-default ">
          <FadersHorizontal className="mr-2 h-4 w-4" />
          <span className="select-none">Preferences</span>
        </div>
        <div className="p-2 flex justify-between items-center">
          <p className="text-sm font-medium select-none">Theme</p>
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <Switch id="theme-toggle" checked={theme === "dark"} onCheckedChange={toggleTheme} />
            <Moon className="h-4 w-4" />
            <Label htmlFor="theme-toggle" className="sr-only">
              Toggle theme
            </Label>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
