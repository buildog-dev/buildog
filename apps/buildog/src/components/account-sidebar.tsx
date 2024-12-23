"use client";

import { cn } from "@repo/ui/lib/utils";
import { Button } from "@ui/components/button";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@ui/components/ui/sidebar";
import { PersonIcon, Half2Icon, LockClosedIcon, HomeIcon } from "@ui/components/react-icons";
interface SidebarProps {
  className?: string;
}

export function AccountSidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const routes = {
    Settings: {
      children: [
        {
          name: "Profile",
          icon: <PersonIcon className="mr-1 h-4 w-4" />,
          route: `/account/settings/profile`,
          key: "account-profile",
        },
        {
          name: "Security",
          icon: <LockClosedIcon className="mr-1 h-4 w-4" />,
          route: `/account/settings/security`,
          key: "account-security",
        },
        {
          name: "Appearance",
          icon: <Half2Icon className="mr-1 h-4 w-4" />,
          route: `/account/settings/appearance`,
          key: "account-appearance",
        },
      ],
    },
  };

  const normalizePath = (path: string) => path.replace(/\/$/, "");

  return (
    <Sidebar collapsible="icon" className="transition-[width] duration-300 ease-in-out">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className={cn("pb-12", className)}>
                <div className="space-y-4 py-4">
                  {Object.entries(routes).map(([key, route]) => (
                    <div key={key}>
                      {!collapsed && (
                        <div className="flex flex-row items-center justify-between transition-all duration-300 overflow-hidden">
                          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{key}</h2>
                          <SidebarTrigger className="mr-4 mb-2" />
                        </div>
                      )}
                      <div className="space-y-1">
                        {route.children.map((child) => {
                          const normalizedPathname = normalizePath(pathname);
                          const normalizedRoute = normalizePath(child.route);
                          return (
                            <SidebarMenuButton
                              onClick={() => router.push(child.route)}
                              key={child.key}
                              variant={
                                normalizedPathname === normalizedRoute ? "outline" : "default"
                              }
                              className="w-full justify-start"
                            >
                              {child.icon}
                              {child.name}
                            </SidebarMenuButton>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <Button
                    onClick={() => router.push("/organizations")}
                    className={`flex justify-center px-2 w-full ${collapsed ? "mt-0" : "mt-4"}`}
                  >
                    {collapsed ? <HomeIcon className="" /> : "Back to Home"}
                  </Button>
                </div>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{collapsed && <SidebarTrigger className="mb-2" />}</SidebarFooter>
    </Sidebar>
  );
}
