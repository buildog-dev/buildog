"use client";

import { cn } from "@repo/ui/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
} from "@ui/components/ui/sidebar";
import { Pencil2Icon, FrameIcon, GlobeIcon, GearIcon } from "@ui/components/react-icons";

interface SidebarProps {
  className?: string;
  organizationId: string;
}

export function AppSidebar({ className, organizationId }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const routes = {
    Main: {
      children: [
        {
          name: "Blog",
          icon: <FrameIcon className="mr-1 h-4 w-4" />,
          route: `/organizations/${organizationId}/blog`,
          key: "main-blog",
        },
        {
          name: "Create Blog",
          icon: <Pencil2Icon className="mr-1 h-4 w-4" />,
          route: `/organizations/${organizationId}/create-blog`,
          key: "main-create-blog",
        },
        {
          name: "Web",
          icon: <GlobeIcon className="mr-1 h-4 w-4" />,
          route: `/organizations/${organizationId}/web`,
          key: "main-web",
        },
        {
          name: "Settings",
          icon: <GearIcon className="mr-1 h-4 w-4" />,
          route: `/organizations/${organizationId}/settings`,
          key: "main-settings",
        },
      ],
    },
  };

  // Normalize pathnames
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
                              className="w-full justify-start overflow-hidden whitespace-nowrap text-ellipsis transition-all duration-300"
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
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{collapsed && <SidebarTrigger className="mb-2" />}</SidebarFooter>
    </Sidebar>
  );
}
