"use client";

import { useCallback, useState, useEffect } from "react";
import { Service } from "@/web-sdk";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { Organization } from "@/types/organization";
import { Card, CardDescription, CardHeader, CardTitle } from "@ui/components/card";
import { Skeleton } from "@ui/components/skeleton";

const organizationCardNames = {
  id: "Organization Id",
  name: "Organization Name",
  description: "Description",
  created_by: "Created By",
};

export default function OrganizationInformation({ organizationId }: { organizationId: string }) {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [organization, setOrganization] = useState<Organization>({
    id: "",
    name: "",
    description: "",
    created_by: "",
  });

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
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchOrganizations();
  }, [user, fetchOrganizations]);

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-[90px] w-[348px] rounded-xl" />
        <Skeleton className="h-[90px] w-[348px] rounded-xl" />
        <Skeleton className="h-[90px] w-[348px] rounded-xl" />
        <Skeleton className="h-[90px] w-[348px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {organization &&
        Object.entries(organization).map(([key, value]) => (
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>{organizationCardNames[key]}</CardTitle>
              <CardDescription>{value}</CardDescription>
            </CardHeader>
          </Card>
        ))}
    </div>
  );
}
