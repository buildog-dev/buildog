"use client";
import Appbar from "@/components/app-bar";
import { Sidebar } from "@/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen max-w-screen max-h-screen overflow-hidden">
      <Sidebar className="w-[300px] hidden lg:block border-r" />
      <div className="flex flex-col lg:w-[calc(100vw-300px)]">
        <Appbar />
        <div className="flex-grow p-5 mx-auto overflow-auto w-full">{children}</div>
      </div>
    </div>
  );
}
