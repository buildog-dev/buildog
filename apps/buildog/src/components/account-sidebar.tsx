"use client";

import { cn } from "@repo/ui/lib/utils";
import { Button } from "@ui/components/button";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  className?: string;
}
import { PersonIcon, Half2Icon, LockClosedIcon } from "@ui/components/react-icons";
export function AccountSidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

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
                      {child.icon}
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
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
