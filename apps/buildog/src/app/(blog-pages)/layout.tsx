'use client'
import { Sidebar } from "@/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-screen">
      <Sidebar className="w-[300px] hidden lg:block border-r" />
      <div className="p-5 mx-auto w-[1300px]">{children}</div>;
    </div>
  );
}
