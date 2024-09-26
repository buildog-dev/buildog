"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@ui/components/input";
import { Button } from "@ui/components/button";
import { ReloadIcon } from "@ui/components/react-icons";
import { Auth } from "@/web-sdk";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/components/form";
import { useToast } from "@ui/components/use-toast";
import { firebaseErrorMessage } from "../lib/firebase-error-message";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

// represents the authentication response.
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

  //extracts the error code from a firebase error message. => Firebase: Error (auth/invalid-credential)
  const extractErrorCode = (errorMessage: string): string => {
    const match = errorMessage.match(/\(auth\/[a-zA-Z0-9\-]+\)/);
    return match ? match[0].replace(/[()]/g, "") : "unknown-error";
  };

  async function onSubmit(data: LoginFromValues) {
    const { email, password } = data;

    setLoading(true);

    // sign in and get the response
    const response: AuthResponse = await Auth.signIn(email, password);

    // If there's an error, handle it
    if (response.error) {
      const errorCode = extractErrorCode(response.error);
      const errMsg = firebaseErrorMessage[errorCode] || "An unknown error occurred.";

      toast({
        title: "Login Failed",
        description: errMsg,
      });
    }
    // Check if the email is verified
    else if (!response.emailVerified) {
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
              {loading && <ReloadIcon />}
              Sign in
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
