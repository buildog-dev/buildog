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

const nameUpdateFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

const emailUpdateFormSchema = z.object({
  email: z.string().email().optional(),
});

type NameUpdateFormValues = z.infer<typeof nameUpdateFormSchema>;
type EmailUpdateFormValues = z.infer<typeof emailUpdateFormSchema>;

export default function ProfilePage() {
  const nameForm = useForm<NameUpdateFormValues>({
    resolver: zodResolver(nameUpdateFormSchema),
    mode: "onChange",
  });

  const emailForm = useForm<EmailUpdateFormValues>({
    resolver: zodResolver(emailUpdateFormSchema),
    mode: "onChange",
  });

  function onNameFormSubmit(data: NameUpdateFormValues) {
    toast({
      title: "You submitted the following name values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  function onEmailFormSubmit(data: EmailUpdateFormValues) {
    toast({
      title: "You submitted the following email value:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Fragment>
      <Form {...nameForm}>
        <form onSubmit={nameForm.handleSubmit(onNameFormSubmit)} className="space-y-8">
          <div className="overflow-y-auto w-full border rounded-lg">
            <div className="w-full p-5 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Profile Information</h2>
              <div className="w-full flex items-center">
                <span className="w-full border-t" />
              </div>
              <FormField
                control={nameForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input className="w-96" type="text" placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={nameForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input className="w-96" type="text" placeholder="Doe" {...field} />
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

      <Form {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(onEmailFormSubmit)} className="space-y-8 mt-8">
          <div className="overflow-y-auto w-full border rounded-lg">
            <div className="w-full p-5 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Account Information</h2>
              <div className="w-full flex items-center">
                <span className="w-full border-t" />
              </div>
              <FormField
                control={emailForm.control}
                name="email"
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
    </Fragment>
  );
}
