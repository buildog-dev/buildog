"use client";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@ui/components/button";
import { usePathname, useRouter } from "next/navigation";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const routes = {
    Main: {
      children: [
        { name: "Blog", icon: "", route: "/blog/", key: "main-blog" },
        {
          name: "Create Blog",
          icon: "",
          route: "/create-blog/",
          key: "main-create-blog",
        },
      ],
    },
  };

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {Object.entries(routes).map(([key, route]) => (
            <div key={key}>
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {key}
              </h2>
              <div className="space-y-1">
                {route.children.map((child) => (
                  <Button
                    onClick={() => router.push(child.route)}
                    key={child.key}
                    variant={pathname === child.route ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    {child.name}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
