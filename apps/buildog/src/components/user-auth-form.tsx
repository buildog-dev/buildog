"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@ui/components/input";
import { Button } from "@ui/components/button";
import { ArrowClockwise } from "@ui/components/react-icons";
import { Auth } from "@/web-sdk";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/components/form";
import { useToast } from "@ui/components/use-toast";
import { firebaseErrorMessage } from "../lib/firebase-error-message";
import { extractErrorCode } from "@/lib/firebase-helper";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface AuthResponse {
  email?: string;
  emailVerified?: boolean;
  error?: string;
}

const loginSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().min(8),
});

type LoginFromValues = z.infer<typeof loginSchema>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFromValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  async function onSubmit(data: LoginFromValues) {
    const { email, password } = data;
    setLoading(true);

    const response: AuthResponse = await Auth.signIn(email, password);

    if (response.error) {
      const errorCode = extractErrorCode(response.error);
      const errMsg = firebaseErrorMessage[errorCode] || "An unknown error occurred.";

      toast({
        title: "Login Failed",
        description: errMsg,
      });
    } else if (!response.emailVerified) {
      toast({
        title: "Email Not Verified",
        description: "Please verify your email.",
      });
    } else {
      router.push("/organizations");
    }

    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-2">
          <div className="grid gap-1">
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
              {loading && <ArrowClockwise />}
              Sign in
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
