"use client";

import { useCallback, useState, useEffect } from "react";
import { Service } from "@/web-sdk";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { Organization } from "@/types/organization";

export default function OrganizationInformation({ organizationId }: { organizationId: string }) {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization>({
    id: "",
    name: "",
    description: "",
    created_by: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Service.makeAuthenticatedRequest("organization", "GET", null, {
        organization_id: organizationId,
      });

      if (response) {
        setOrganization(response);
      }
    } catch (error) {
      router.push("/not-found");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchOrganizations();
  }, [user, fetchOrganizations]);

  return (
    <div>
      {loading ? (
        <>Loading</>
      ) : (
        <>
          <h1>Organization id: {organization.id}</h1>
          <h1>Organization id: {organization.name}</h1>
          <h1>Organization id: {organization.description}</h1>
          <p>This is the overview page for the organization.</p>
        </>
      )}
    </div>
  );
}
