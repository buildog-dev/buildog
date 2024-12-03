"use client";

import React, { useCallback, useEffect, useState } from "react";
import { DataTable } from "@ui/components/ui/data-table";
import { PersonIcon } from "@ui/components/react-icons";
import { useParams } from "next/navigation";
import { Service } from "@/web-sdk";
import { useAuth } from "@/components/auth-provider";
import UserInfoModal from "./user-info-modal";
import { Button } from "@ui/components/button";

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
    }
  }, [user, organizationId]);

  useEffect(() => {
    getUserList();
  }, [user, getUserList]);

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

        return (
          <UserInfoModal rowUser={user} setUsers={setUsers} mode={"edit"} />
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
              This organization currently doesn't have any users.
            </p>
            <UserInfoModal setUsers={setUsers} mode={"add"} />
          </div>
        </div>
      )}

      <UserInfoModal setUsers={setUsers} mode={"add"}/>
    </div>
  );
}
