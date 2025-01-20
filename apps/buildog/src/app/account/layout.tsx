import React from "react";
import Appbar from "@/components/app-bar";
import { SidebarProvider } from "@ui/components/ui/sidebar";
import { AccountSidebar } from "@/components/account-sidebar";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AccountSidebar />
        <div className="flex flex-col w-full">
          <Appbar />
          <main className="flex-grow p-5 mx-auto overflow-auto w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
