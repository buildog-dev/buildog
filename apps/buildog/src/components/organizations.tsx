"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { useRouter } from "next/navigation";
import getOrganizations from "@/lib/get-organizations";

export function Organizations() {
  const [organizations, setOrganizations] = useState([]);
  const [newOrgName, setNewOrgName] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchOrganizations() {
      const orgs = await getOrganizations();
      setOrganizations(orgs);
    }

    fetchOrganizations();
  }, []);

  const handleCreateOrganization = async () => {
    console.log("Creating organization:", newOrgName);

    // We will add creating tenants here when the backend is ready
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Title and description */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Your Organizations</h2>
          {organizations.length === 0 && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">
                You have not added any organizations yet.
              </p>
            </div>
          )}
        </div>

        {/* Organization list */}
        {organizations.length > 0 && (
          <ul className="space-y-4 mb-6">
            {organizations.map((org) => (
              <li key={org.id}>
                <Button
                  onClick={() => router.push(`/organizations/${org.name}/blog`)}
                  variant="outline"
                  className="w-full text-left"
                >
                  {org.name}
                </Button>
              </li>
            ))}
          </ul>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full">
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
              <DialogDescription>Enter the name of your new organization.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="My Unique Organization"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateOrganization} className="w-full">
                Create Organization
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
