"use client";
import { Fragment } from "react";
import { useTheme } from "next-themes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CaretDown } from "@ui/components/react-icons";
import { cn } from "@repo/ui/lib/utils";
import { buttonVariants } from "@ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/form";
import { toast } from "@ui/components/use-toast";
import { Tabs, TabsContent } from "@ui/components/tabs";

const settingsThemeFormSchema = z.object({
  theme: z.enum(["dark", "light", "system"], {
    invalid_type_error: "Select a theme",
    required_error: "Please select a theme.",
  }),
});

type SettingsThemeFormValues = z.infer<typeof settingsThemeFormSchema>;

// This can come from your database or API.
export default function Page() {
  const { theme, setTheme } = useTheme();

  const themeForm = useForm<SettingsThemeFormValues>({
    resolver: zodResolver(settingsThemeFormSchema),
    mode: "onChange",
  });

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
      <Tabs defaultValue="theme" className="w-full">
        <TabsContent value="theme">
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
                  defaultValue={theme as "dark" | "light" | "system"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select interface theme</FormLabel>
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
                            <option value="system">System Theme</option>
                          </select>
                        </FormControl>
                        <CaretDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </Fragment>
  );
}
