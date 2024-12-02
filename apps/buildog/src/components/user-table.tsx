"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@ui/components/button";
import { DataTable } from "@ui/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
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
import { PersonIcon } from "@ui/components/react-icons";
import { CaretDownIcon } from "@ui/components/react-icons";
import { Input } from "@ui/components/input";
import { useParams } from "next/navigation";
import { Service } from "@/web-sdk";
import { useAuth } from "@/components/auth-provider";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuth();
  const params = useParams();
  const { organizationId } = params;
  const [open, setOpen] = useState(false);

  const getUserList = useCallback(async () => {
    if (!user) return;

    try {
      if (!organizationId || Array.isArray(organizationId)) return;

      const response = await Service.makeAuthenticatedRequest("organization-user", "GET", null, {
        organization_id: organizationId,
      });

      if (response) {
        setUsers(response);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      // Handle error appropriately (e.g., show error message to user)
    }
  }, [user, organizationId]);

  useEffect(() => {
    getUserList(); // Call getUserList when user changes
  }, [user, getUserList]);

  const deleteUser = (userId: number) => {
    setOpen(!open);

    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.filter((user) => user.id !== userId);
      return updatedUsers;
    });
  };

  const tableData = () => {
    return users.map((user) => {
      const date = new Date(user.created_at);

      const formattedDate = date.toLocaleDateString("en-US");
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        email: user.email,
        created_at: `${formattedDate} ${formattedTime}`,
      };
    });
  };

  const columns = [
    {
      id: "first_name",
      accessorKey: "first_name",
      header: "First Name",
      enableSorting: true,
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
      enableSorting: true,
      cell: ({ getValue }) => <div>{getValue()}</div>,
    },
    {
      accessorKey: "email",
      header: "E-Mail",
      enableSorting: true,
      cell: ({ getValue }) => <div>{getValue()}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      enableSorting: true,
      cell: ({ getValue }) => <div>{getValue()}</div>,
    },
    {
      accessorKey: "created_at",
      header: "Creation Date",
      enableSorting: true,
      cell: ({ getValue }) => <div>{getValue()}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      id: "actions",
      enableSorting: false,
      cell: ({ row }) => {
        const user = row.original;

        const [firstName, setFirstName] = useState(user.first_name);
        const [lastName, setLastName] = useState(user.last_name);
        const [role, setRole] = useState(user.role);

        const saveUserChanges = () => {
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.id === user.id ? { ...u, first_name: firstName, last_name: lastName, role } : u
            )
          );
          setOpen(false);
        };

        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Change the name and role of the user or delete the user
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled
                    />
                  </div>
                </div>

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
                        <DropdownMenuItem onClick={() => setRole("writer")}>
                          writer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRole("reader")}>
                          reader
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button className="bg-red-500 hover:bg-red-600" onClick={() => deleteUser(user.id)}>
                  Delete
                </Button>
                <Button onClick={saveUserChanges}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {users.length > 0 ? (
        <DataTable columns={columns} data={tableData()} filterColumnId={"first_name"} />
      ) : (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <PersonIcon className="h-10 w-10 text-muted-foreground" />

            <h3 className="mt-4 text-lg font-semibold">No Users Found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              This organizations currently doesn't have any users.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="relative">
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add User</DialogTitle>
                  <DialogDescription>Write the name of the user you want add.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="url">Name of the User</Label>
                    <Input id="url" placeholder="John Doe" />
                  </div>
                </div>
                <DialogFooter>
                  <Button>Add User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
}
