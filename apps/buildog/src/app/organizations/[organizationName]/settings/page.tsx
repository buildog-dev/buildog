"use client";
import { Fragment } from "react";
import { useTheme } from "next-themes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronDownIcon } from "@ui/components/react-icons";
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

// This can come from your database or API.
export default function Page() {
  const { theme, setTheme } = useTheme();

  const informationForm = useForm<SettingsInformationFormValues>({
    resolver: zodResolver(settingsInformationFormSchema),
    mode: "onChange",
  });
  const themeForm = useForm<SettingsThemeFormValues>({
    resolver: zodResolver(settingsThemeFormSchema),
    mode: "onChange",
  });

  function onInformationFormSubmit(data: SettingsInformationFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  function onThemeChange(data: SettingsThemeFormValues) {
    setTheme(data.theme);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Fragment>
      <Tabs defaultValue="information" className="w-full">
        <TabsList>
          <TabsTrigger value="information">Information</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="information">
          <Form {...informationForm}>
            <form
              onSubmit={informationForm.handleSubmit(onInformationFormSubmit)}
              className="space-y-8"
            >
              <div className="overflow-y-auto w-full border rounded-lg">
                <div className="w-full p-5 space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight">Information</h2>
                  <div className="w-full flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <FormField
                    control={informationForm.control}
                    name="email"
                    disabled={true}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            className="w-96"
                            type="email"
                            placeholder="buildog@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <hr />
                <div className="w-full p-4 space-y-4 flex justify-end">
                  <Button type="submit">Save</Button>
                </div>
              </div>
            </form>
          </Form>
          <Form {...themeForm}>
            <form onChange={themeForm.handleSubmit(onThemeChange)} className="space-y-8">
              <div className="overflow-y-auto w-full p-5 border rounded-lg space-y-4 mt-4">
                <h2 className="text-2xl font-bold tracking-tight">Theme</h2>
                <div className="w-full flex items-center">
                  <span className="w-full border-t" />
                </div>
                <FormField
                  control={themeForm.control}
                  name="theme"
                  defaultValue={theme as "dark" | "light"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interface theme</FormLabel>
                      <div className="relative w-max">
                        <FormControl>
                          <select
                            className={cn(
                              buttonVariants({ variant: "outline" }),
                              "w-[200px] appearance-none font-normal"
                            )}
                            {...field}
                          >
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                          </select>
                        </FormControl>
                        <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="users">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
              <p className="text-sm text-muted-foreground">Users signed in to this organization.</p>
            </div>
          </div>
          <Separator className="my-4" />
          {/* <Organizations /> */}
          <p>
            Users signed in for this organization will appear here after connecting the backend.
          </p>
        </TabsContent>
      </Tabs>
    </Fragment>
  );
}
