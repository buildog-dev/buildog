"use client";

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

const settingsFormSchema = z.object({
  email: z.string().email().optional(),
  theme: z.enum(["dark", "light"], {
    invalid_type_error: "Select a theme",
    required_error: "Please select a theme.",
  }),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

// This can come from your database or API.
export default function Page() {
  const { theme, setTheme } = useTheme();
  console.log(theme);
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    mode: "onChange",
  });

  function onSubmit(data: SettingsFormValues) {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="overflow-y-auto w-full p-5 border rounded-lg space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Information</h2>
          <div className="w-full flex items-center">
            <span className="w-full border-t" />
          </div>
          <FormField
            control={form.control}
            name="email"
            disabled={true}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="buildog@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="overflow-y-auto w-full p-5 border rounded-lg space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Theme</h2>
          <div className="w-full flex items-center">
            <span className="w-full border-t" />
          </div>
          <FormField
            control={form.control}
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
        <Button type="submit">Update settings</Button>
      </form>
    </Form>
  );
}
