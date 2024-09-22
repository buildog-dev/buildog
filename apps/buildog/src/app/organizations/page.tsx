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
import { Card } from "@repo/ui/components/ui/card";
import { ArrowRightIcon, PlusCircledIcon } from "@ui/components/ui/react-icons";
import { Auth, Service } from "@/web-sdk";

export default function Page() {
  const [organizations, setOrganizations] = useState([]);
  const [newOrgName, setNewOrgName] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const response = await Service.makeAuthenticatedRequest("orgs");
      setOrganizations(response);
    })();
  }, []);

  const handleCreateOrganization = async () => {
    console.log("Creating organization:", newOrgName);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-6xl mx-auto">
      {organizations.length === 0 ? (
        // No organizations case
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <PlusCircledIcon className="h-12 w-12 text-gray-500" />
          <p className="text-lg text-gray-700">You don’t have any organizations yet.</p>
          <p className="text-sm text-gray-500">Click the button below to add a new one.</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="mt-4">
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
      ) : (
        // Organizations present case
        <div className="w-full">
          <div className="flex items-center justify-between w-full mb-6">
            <h2 className="text-2xl font-semibold">Your Organizations</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg">Add Organization</Button>
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
                      placeholder="Organization Name"
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

          {/* Organization cards grid */}
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
            {organizations.map((org) => (
              <Card
                key={org.OrganizationId}
                className="p-6 cursor-pointer h-36 w-full max-w-lg flex items-center justify-between border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
                onClick={() => router.push(`/organizations/${org.OrganizationId}/`)}
              >
                <div className="flex flex-col w-full">
                  <div className="text-xl font-semibold mb-2">{org.OrganizationName}</div>
                  <div className="text-sm text-gray-600 mb-4">
                    <div className="mb-1">{org.OrganizationDescription}</div>
                  </div>
                </div>
                <div className="text-xl text-gray-500">
                  <ArrowRightIcon className="h-6 w-6" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
