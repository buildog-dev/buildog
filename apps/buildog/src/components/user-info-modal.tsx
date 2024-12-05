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

  // Populate fields if editing an existing user
  useEffect(() => {
    if (mode === "edit" && user) {
      setFirstName(rowUser.first_name || "");
      setLastName(rowUser.last_name || "");
      setEmail(rowUser.email || "");
      setRole(rowUser.role || "");
    }
  }, [user, mode]);

  const addUserHandler = useCallback(async () => {
    if (!user) {
      alert("Unauthorized: Please log in.");
      return;
    }

    if (!email || !role) {
      alert("Email and role are required for adding a user.");
      return;
    }

    try {
      if (!organizationId || Array.isArray(organizationId)) return;

      const response = await Service.makeAuthenticatedRequest(
        "organization-user",
        "POST",
        { Email: email, Role: role }, // Payload
        { organization_id: organizationId } // Headers
      );

      if (response) {
        alert("User added successfully!");
        setUsers((prevUsers) => [...prevUsers, { email, role }]);
        setOpen(false);
      }
    } catch (error) {
      console.error("Failed to create organization user:", error);
      alert("Failed to add user. Please try again.");
    }
  }, [user, organizationId, email, role]);

  const deleteUserHandler = useCallback(async () => {
    if (!user) {
      alert("Unauthorized: Please log in.");
      return;
    }

    console.log(rowUser);
  
    if (!rowUser || !rowUser.user_id) {
      alert("Invalid user data. Cannot delete.");
      return;
    }
    console.log("Deleting user:", rowUser.user_id)
  
    try {
      if (!organizationId || Array.isArray(organizationId)) return;

  
      const response = await Service.makeAuthenticatedRequest(
        "organization-user",
        "DELETE",
        { user_id: rowUser.user_id },
        { organization_id: organizationId }
      );

      console.log(response);
  
      if (response) {
        alert("User deleted successfully!");
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== rowUser.user_id));
      }
    } catch (error) {
      console.error("Failed to delete organization user:", error);
      alert("Failed to delete user. Please try again.");
    }
  }, [user, organizationId, rowUser?.user_id, setUsers]);
  
  

  const saveUserChanges = () => {
    if (mode === "edit") {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === rowUser.user_id ? { ...u, first_name: firstName, last_name: lastName, role } : u
        )
      );
      setOpen(false);
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
          {mode === "add" && (
            <>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </>
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
