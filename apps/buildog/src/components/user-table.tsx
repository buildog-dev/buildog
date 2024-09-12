"use client";

import React, { useState } from "react";
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
import { Input } from "@ui/components/input";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

const dummyUsers: User[] = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    created_at: "2023-07-15T10:15:30Z",
    updated_at: "2023-09-10T14:20:45Z",
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    created_at: "2023-06-20T09:05:20Z",
    updated_at: "2023-09-12T16:10:55Z",
  },
  {
    id: 3,
    first_name: "Michael",
    last_name: "Brown",
    email: "michael.brown@example.com",
    created_at: "2023-08-01T11:25:40Z",
    updated_at: "2023-09-11T18:30:35Z",
  },
  {
    id: 4,
    first_name: "Emily",
    last_name: "Davis",
    email: "emily.davis@example.com",
    created_at: "2023-07-30T12:45:50Z",
    updated_at: "2023-09-12T19:45:15Z",
  },
];

export default function UserTable() {
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [open, setOpen] = useState(false);

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

      const formattedDate = date.toLocaleDateString("en-GB");
      const formattedTime = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        created_at: `${formattedDate} - ${formattedTime}`, // Combine date and time
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
      enableSorting: false,
      cell: ({ getValue }) => <div>{getValue()}</div>,
    },
    {
      accessorKey: "email",
      header: "E-Mail",
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
        const userId = row.original.id;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                ...
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  deleteUser(userId);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
