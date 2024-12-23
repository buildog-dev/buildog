"use client";

import Appbar from "@/components/app-bar";
import { Sidebar } from "@/components/sidebar";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { organizationId: string };
}) {
  const { organizationId } = params;

  return (
    <div className="flex w-full">
      <Sidebar className="w-[300px] border-r" organizationId={organizationId} />
      <div className="flex flex-col w-full">
        <Appbar />
        <div>{children}</div>
      </div>
    </div>
  );
}
