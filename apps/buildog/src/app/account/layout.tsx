import React from "react";
import Appbar from "@/components/app-bar";
import { AccountSidebar } from "@/components/account-sidebar";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full">
      <AccountSidebar className="w-[300px] border-r" />
      <div className="flex flex-col w-full">
        <Appbar />
        <div className="flex-grow p-5 mx-auto overflow-auto w-full">{children}</div>
      </div>
    </div>
  );
}
