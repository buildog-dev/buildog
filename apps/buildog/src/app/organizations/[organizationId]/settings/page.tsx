"use client";

import { use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { Separator } from "@ui/components/separator";
import UserTable from "@/components/user-table";
import OrganizationInformation from "@/components/organization-information";

export default function Page({ params }: { params: Promise<{ organizationId: string }> }) {
  const { organizationId } = use(params);

  return (
    <Tabs defaultValue="information" className="w-full space-y-4">
      <TabsList>
        <TabsTrigger value="information">Information</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>

      <TabsContent value="information">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Information</h2>
            <p className="text-sm text-muted-foreground">Organization information</p>
          </div>
        </div>
        <Separator className="my-4" />
        <OrganizationInformation organizationId={organizationId} />
      </TabsContent>

      <TabsContent value="users">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
            <p className="text-sm text-muted-foreground">Users signed in to this organization.</p>
          </div>
        </div>
        <Separator className="my-4" />
        <UserTable />
      </TabsContent>
    </Tabs>
  );
}
