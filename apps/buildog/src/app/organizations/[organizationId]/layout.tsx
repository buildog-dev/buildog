'use client'

import Appbar from "@/components/app-bar";
import { useCallback, useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Service } from "@/web-sdk";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { organizationId: string };
}) {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const { organizationId } = params;
  const router = useRouter();

  const fetchOrganizations = useCallback(async () => {
    const response = await Service.makeAuthenticatedRequest("organizations");
    if (response) {
      setOrganizations(response);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchOrganizations();
  }, [user, fetchOrganizations]);

  useEffect(() => {
    if (organizations.length === 0) return;

    const orgExists = organizations.some((org) => org.OrganizationId === organizationId);
    if (!orgExists) {
      router.replace("/not-found");
    }
  }, [organizations, organizationId, router]);

  return (
    <div className="flex w-full">
      <Sidebar className="w-[300px] border-r" organizationId={organizationId} />
      <div className="flex flex-col w-full">
        <Appbar />
        <div className="flex-grow p-5 mx-auto overflow-auto w-full">{children}</div>
      </div>
    </div>
  );
}
