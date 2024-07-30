"use client";
import Appbar from "@/components/app-bar";
import { Sidebar } from "@/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full">
      <Sidebar className="w-[300px] border-r" />
      <div className="flex flex-col w-full">
        <Appbar />
        <div className="flex-grow p-5 mx-auto overflow-auto w-full">{children}</div>
      </div>
    </div>
  );
}
