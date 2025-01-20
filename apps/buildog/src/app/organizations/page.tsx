"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { useRouter } from "next/navigation";
import { Card } from "@repo/ui/components/ui/card";
import { ArrowRight, PlusCircle } from "@ui/components/react-icons";
import { Service } from "@/web-sdk";
import { useAuth } from "@/components/auth-provider";
import OrganizationsHeader from "@/components/organizations-header";

export default function Page() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgDescription, setNewOrgDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleCreateOrganization = async () => {
    setIsLoading(true);
    const response = await Service.makeAuthenticatedRequest("organizations", "POST", {
      organization_name: newOrgName,
      organization_description: newOrgDescription,
    });
    if (response) {
      setIsLoading(false);
      fetchOrganizations();
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="min-h-screen p-6 pt-24 w-full max-w-6xl mx-auto">
        <OrganizationsHeader />
        {organizations.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <PlusCircle className="h-12 w-12 text-gray-500" />
            <p className="text-lg text-gray-700">You don’t have any organizations yet.</p>
            <p className="text-sm text-gray-500">Click the button below to add a new one.</p>
            <Button size="lg" onClick={() => setIsModalOpen(true)}>
              Add Organization
            </Button>
          </div>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between w-full mb-6 px-2">
              <h2 className="text-2xl font-semibold">Your Organizations</h2>
              <Button size="lg" onClick={() => setIsModalOpen(true)}>
                Add Organization
              </Button>
            </div>
            <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 overflow-hidden px-2 pb-6">
              {organizations.map((org) => (
                <Card
                  key={org.organization_id}
                  className="p-6 cursor-pointer h-36 w-full flex items-center justify-between border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
                  onClick={() => router.push(`/organizations/${org.organization_id}/`)}
                >
                  <div className="flex flex-col w-full">
                    <div className="text-xl font-semibold mb-2">{org.organization_name}</div>
                    <div className="text-sm text-gray-600 mb-4">
                      <div className="mb-1">{org.organization_description}</div>
                    </div>
                  </div>
                  <div className="text-xl text-gray-500">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
              <DialogDescription>Enter the name of your new organization.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="Organization Name"
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="orgDescription">Organization Description</Label>
                <Textarea
                  id="orgDescription"
                  value={newOrgDescription}
                  onChange={(e) => setNewOrgDescription(e.target.value)}
                  placeholder="Organization Description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateOrganization} className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Organization"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
