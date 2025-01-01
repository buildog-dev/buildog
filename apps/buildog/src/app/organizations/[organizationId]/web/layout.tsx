"use client";

import Appbar from "@/components/app-bar";
import { SidebarProvider } from "@ui/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { organizationId: string };
}) {
  const { organizationId } = params;

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar organizationId={organizationId} />
        <div className="flex flex-col w-full">
          <Appbar />
          <main className="flex-grow mx-auto overflow-auto w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
