"use client";

import { cn } from "@repo/ui/lib/utils";
import { Button } from "@ui/components/button";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  className?: string;
  organizationId: string; // Accept organizationName as a prop
}

export function Sidebar({ className, organizationId }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const routes = {
    Main: {
      children: [
        {
          name: "Blog",
          icon: "",
          route: `/organizations/${organizationId}/blog`, // Dynamic route
          key: "main-blog",
        },
        {
          name: "Create Blog",
          icon: "",
          route: `/organizations/${organizationId}/create-blog`,
          key: "main-create-blog",
        },
        {
          name: "Web",
          icon: "",
          route: `/organizations/${organizationId}/web`,
          key: "main-web",
        },
        {
          name: "Settings",
          icon: "",
          route: `/organizations/${organizationId}/settings`,
          key: "main-settings",
        },
      ],
    },
  };

  // Normalize pathnames
  const normalizePath = (path: string) => path.replace(/\/$/, "");

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {Object.entries(routes).map(([key, route]) => (
            <div key={key}>
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{key}</h2>
              <div className="space-y-1">
                {route.children.map((child) => {
                  const normalizedPathname = normalizePath(pathname);
                  const normalizedRoute = normalizePath(child.route);

                  return (
                    <Button
                      onClick={() => router.push(child.route)}
                      key={child.key}
                      variant={normalizedPathname === normalizedRoute ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      {child.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4 px-4">
          <Button onClick={() => router.push("/organizations")} className="w-full">
            Back to Organizations
          </Button>
        </div>
      </div>
    </div>
  );
}
