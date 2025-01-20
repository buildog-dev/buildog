"use client";
import { Fragment } from "react";
import { useTheme } from "next-themes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@repo/ui/lib/utils";
import { Button, buttonVariants } from "@ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/form";
import { Input } from "@ui/components/input";
import { toast } from "@ui/components/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { Separator } from "@ui/components/separator";
import UserTable from "@/components/user-table";
import OrganizationInformation from "@/components/organization-information";

const settingsInformationFormSchema = z.object({
  email: z.string().email().optional(),
});

const settingsThemeFormSchema = z.object({
  theme: z.enum(["dark", "light"], {
    invalid_type_error: "Select a theme",
    required_error: "Please select a theme.",
  }),
});

type SettingsInformationFormValues = z.infer<typeof settingsInformationFormSchema>;
type SettingsThemeFormValues = z.infer<typeof settingsThemeFormSchema>;

export default function Page({ params }: { params: { organizationId: string } }) {
  return (
    <Fragment>
      <Tabs defaultValue="information" className="w-full">
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
          <OrganizationInformation organizationId={params.organizationId} />
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
    </Fragment>
  );
}
