"use client";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/components/button";
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

const passwordUpdateFormSchema = z.object({
  newPassword: z.string().min(8, "New password must be at least 8 characters long"),
});

type PasswordUpdateFormValues = z.infer<typeof passwordUpdateFormSchema>;

export default function ProfilePage() {
  const passwordForm = useForm<PasswordUpdateFormValues>({
    resolver: zodResolver(passwordUpdateFormSchema),
    mode: "onChange",
  });

  function onPasswordFormSubmit(data: PasswordUpdateFormValues) {
    toast({
      title: "You submitted the following password value:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Fragment>
      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(onPasswordFormSubmit)} className="space-y-8">
          <div className="overflow-y-auto w-full border rounded-lg">
            <div className="w-full p-5 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Change Your Password</h2>
              <h4 className="text-sm font-semibold tracking-tight">
                Type in a new secure password and press save to update your password
              </h4>
              <div className="w-full flex items-center">
                <span className="w-full border-t" />
              </div>
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input className="w-96" type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <hr />
            <div className="w-full p-4 space-y-4 flex justify-end">
              <Button type="submit">Save New Password</Button>
            </div>
          </div>
        </form>
      </Form>
    </Fragment>
  );
}
