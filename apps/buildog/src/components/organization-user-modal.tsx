"use client";

import React, { useState } from "react";
import { Button } from "@ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/dialog";
import { Label } from "@ui/components/label";
import { CaretDown } from "@ui/components/react-icons";
import { Input } from "@ui/components/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Service } from "@/web-sdk";
import { useParams } from "next/navigation";
import { toast } from "@ui/components/use-toast";
import { OrganizationUser } from "@/types/organization";

export default function OrganizationUserModal({
  user,
  mode,
  getUserList,
}: {
  user?: OrganizationUser;
  mode: "add" | "edit";
  getUserList: () => Promise<void>;
}) {
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "");

  const [open, setOpen] = useState(false);
  const params = useParams();
  const { organizationId } = params;

  const updateUserRoleHandler = async () => {
    if (!user || !user.user_id || !role) {
      toast({
        title: "Invalid user data or role not selected.",
        variant: "destructive",
      });
      return;
    }

    if (user.role == role) {
      setOpen(false);
      return;
    }

    try {
      if (!organizationId) return;

      const response = await Service.makeAuthenticatedRequest(
        "organization-user",
        "PUT",
        {
          user_id: user.user_id,
          role: role,
        },
        { organization_id: organizationId as string }
      );

      if (response) {
        toast({
          title: response.message,
          description: `Changed user role to ${role}`,
        });
        getUserList();
      }
    } catch (error) {
      toast({
        title: "Failed to update user role",
        description: `Error: ${error}`,
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };

  const addUserHandler = async () => {
    if (!email || !role) {
      toast({
        title: "Email and role are required for adding a user.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!organizationId) return;

      const response = await Service.makeAuthenticatedRequest(
        "organization-user",
        "POST",
        { Email: email, Role: role },
        { organization_id: organizationId as string }
      );

      if (response) {
        toast({
          title: "Added user to organization successfully!",
          description: `${email} added as ${role}.`,
        });
        getUserList();
      }
    } catch (error) {
      toast({
        title: "Failed to add user to organization!",
        description: `Error: ${error}`,
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };

  const deleteUserHandler = async () => {
    if (!user || !user.user_id) {
      toast({
        title: "Invalid user data!",
        description: "Can't remove user with invalid data.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!organizationId) return;

      const response = await Service.makeAuthenticatedRequest(
        "organization-user",
        "DELETE",
        { user_id: user.user_id },
        { organization_id: organizationId as string }
      );

      if (response) {
        toast({
          title: "User deleted successfully!",
          description: `${user.email} removed from organization.`,
        });
        getUserList();
      }
    } catch (error) {
      toast({
        title: "Failed to remove user!",
        description: `Error: ${error}`,
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };

  const saveUserChanges = () => {
    if (mode === "edit") {
      updateUserRoleHandler();
    } else if (mode === "add") {
      addUserHandler();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="relative">{mode === "edit" ? "Edit" : "Add"} User</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit User" : "Add User"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Change the role of the user or delete the user from the organization."
              : "Add a new user to your organization by filling out the required fields."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {mode === "edit" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={user?.first_name} disabled />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={user?.last_name} disabled />
              </div>
            </div>
          )}

          {mode === "add" && (
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          )}

          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <span>User Role:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center justify-between">
                    {role || "Select role"}
                    <CaretDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setRole("admin")}>admin</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRole("writer")}>writer</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRole("reader")}>reader</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <DialogFooter>
          {mode === "edit" && (
            <Button variant="destructive" onClick={deleteUserHandler}>
              Delete User
            </Button>
          )}
          <Button onClick={saveUserChanges}>{mode === "edit" ? "Save Changes" : "Add User"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
