"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@ui/components/input";
import { Button } from "@ui/components/button";
import { ReloadIcon } from "@ui/components/react-icons";
import { signUpService } from "@/web-sdk";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/components/form";
import { toast } from "@ui/components/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const profileFormSchema = z.object({
  first_name: z.string().nonempty(),
  last_name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  password: z.string().min(8),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function SignUpForm({ className, ...props }: UserAuthFormProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onSubmit",
  });

  async function onSubmit(data: ProfileFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    const email = data.email;
    const password = data.password;
    const first_name = data.first_name;
    const last_name = data.last_name;

    setLoading(true);

    try {
      const response = await signUpService.signUp({
        firstName: first_name,
        lastName: last_name,
        email: email,
        password: password,
      });

      if (response.isSignedIn) {
        router.push("/blog/");
      } else {
        console.log(response.error);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-2">
          <div className="grid gap-1">
            <FormField
              control={form.control}
              name="first_name"
              disabled={loading}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="w-96" type="text" placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              disabled={loading}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="w-96" type="text" placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              disabled={loading}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-96"
                      type="email"
                      placeholder="name@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              disabled={loading}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="w-96" type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading}>
              {loading && <ReloadIcon />}
              Sign up
            </Button>
            <div></div>
          </div>
        </div>
      </form>
    </Form>
  );
}
