"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { CaretDownIcon } from "@ui/components/react-icons";
import { Input } from "@ui/components/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Service } from "@/web-sdk";
import { useAuth } from "@/components/auth-provider";
import { useParams } from "next/navigation";
import { toast } from "@ui/components/use-toast";

export default function UserInfoModal({
  rowUser,
  setUsers,
  mode,
}: {
  rowUser?: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
  mode: "add" | "edit";
}) {
  const [firstName, setFirstName] = useState(rowUser?.first_name || "");
  const [lastName, setLastName] = useState(rowUser?.last_name || "");
  const [email, setEmail] = useState(rowUser?.email || "");
  const [role, setRole] = useState(rowUser?.role || "");
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const params = useParams();
  const { organizationId } = params;

  useEffect(() => {
    if (mode === "edit" && user) {
      setFirstName(rowUser.first_name || "");
      setLastName(rowUser.last_name || "");
      setEmail(rowUser.email || "");
      setRole(rowUser.role || "");
    }
  }, [user, mode]);

  useEffect(() => {
    if (!open) {
      setFirstName(rowUser?.first_name || "");
      setLastName(rowUser?.last_name || "");
      setEmail(rowUser?.email || "");
      setRole(rowUser?.role || "");
    }
  }, [open, rowUser]);

  const updateUserRoleHandler = useCallback(async () => {
    if (!user) {
      toast({
        title: "Unauthorized: Please log in!",
        variant: "destructive",
      });
      return;
    }

    if (!rowUser || !rowUser.user_id || !role) {
      toast({
        title: "Invalid user data or role not selected.",
        variant: "destructive",
      });
      return;
    }

    if (rowUser.role == role) {
      setOpen(false);
      return;
    }

    try {
      if (!organizationId || Array.isArray(organizationId)) return;

      const response = await Service.makeAuthenticatedRequest(
        "organization-user",
        "PUT",
        {
          user_id: rowUser.user_id,
          role: role,
        },
        { organization_id: organizationId }
      );

      if (response) {
        toast({
          title: "Updated user role successfully!",
          description: `Changed user role to ${role}`,
        });
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.user_id === rowUser.user_id ? { ...u, role } : u))
        );
        setOpen(false);
      }
    } catch (error) {
      console.error("Failed to update user role:", error);
      setOpen(false);
      toast({
        title: "Failed to update user role",
        description: `Error: ${error}`,
        variant: "destructive",
      });
    }
  }, [user, organizationId, rowUser?.user_id, role, setUsers]);

  const addUserHandler = useCallback(async () => {
    if (!user) {
      toast({
        title: "Unauthorized: Please log in!",
        variant: "destructive",
      });
      return;
    }

    if (!email || !role) {
      toast({
        title: "Email and role are required for adding a user.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!organizationId || Array.isArray(organizationId)) return;

      const response = await Service.makeAuthenticatedRequest(
        "organization-user",
        "POST",
        { Email: email, Role: role },
        { organization_id: organizationId }
      );

      if (response) {
        toast({
          title: "Added user to organization successfully!",
          description: `${email} added as ${role}.`,
        });

        const newUser = {
          user_id: response.user_id,
          first_name: response.first_name || "",
          last_name: response.last_name || "",
          email: email,
          role: role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setUsers((prevUsers) => [...prevUsers, newUser]);
        setOpen(false);
      }
    } catch (error) {
      console.error("Failed to create organization user:", error);
      toast({
        title: "Failed to add user to organization!",
        description: `Error: ${error}`,
        variant: "destructive",
      });
      setOpen(false);
    }
  }, [user, organizationId, email, role]);

  const deleteUserHandler = useCallback(async () => {
    if (!user) {
      toast({
        title: "Unauthorized: Please log in!",
        variant: "destructive",
      });
      return;
    }

    if (!rowUser || !rowUser.user_id) {
      toast({
        title: "Invalid user data!",
        description: "Can't remove user with invalid data.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!organizationId || Array.isArray(organizationId)) return;

      const response = await Service.makeAuthenticatedRequest(
        "organization-user",
        "DELETE",
        { user_id: rowUser.user_id },
        { organization_id: organizationId }
      );

      if (response) {
        toast({
          title: "User deleted successfully!",
          description: `${rowUser.email} removed from organization.`,
        });

        setUsers((prevUsers) => prevUsers.filter((u) => u.user_id !== rowUser.user_id));

        setOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete organization user:", error);
      toast({
        title: "Failed to remove user!",
        description: `Error: ${error}`,
        variant: "destructive",
      });
      setOpen(false);
    }
  }, [user, organizationId, rowUser?.user_id, setUsers]);

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
        <Button variant="outline" size="sm" className="relative">
          {mode === "edit" ? "Edit" : "Add"} User
        </Button>
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
                <Input id="firstName" value={firstName} disabled />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={lastName} disabled />
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
                    <CaretDownIcon className="w-4 h-4 ml-2" />
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
