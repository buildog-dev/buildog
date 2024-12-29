"use client";

import React, { useState } from "react";
import { Input } from "@ui/components/input";
import { Button } from "@ui/components/button";
import { ArrowClockwise } from "@ui/components/react-icons";
import { Auth, Service } from "@/web-sdk";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/components/form";
import { Label } from "@ui/components/label";
import { Card, CardDescription, CardHeader, CardTitle } from "@ui/components/card";
import { useToast } from "@ui/components/use-toast";
import { firebaseErrorMessage } from "../lib/firebase-error-message";
import { extractErrorCode } from "@/lib/firebase-helper";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const profileFormSchema = z.object({
  first_name: z.string().nonempty(),
  last_name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  password: z.string().min(8),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function SignUpForm({ className, ...props }: UserAuthFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [verifyYourEmail, setVerifyYourEmail] = useState<boolean>(false);
  const [error, setError] = useState<String>(null);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onSubmit",
  });
  async function onSubmit(data: ProfileFormValues) {
    const { first_name, last_name, email, password } = data;

    setLoading(true);

    const response = await Auth.signUp(email, password);

    if ("error" in response) {
      const errorCode = extractErrorCode(response.error);
      const errMsg = firebaseErrorMessage[errorCode] || "An unknown error occurred.";

      toast({
        title: "Sign Up Failed",
        description: errMsg,
      });
    } else {
      const createUserResponse = await Service.makeAuthenticatedRequest("user", "POST", {
        first_name,
        last_name,
        email,
      });

      if (createUserResponse) {
        setVerifyYourEmail(true);
      }
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      {verifyYourEmail ? (
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Check your email to confirm</CardTitle>
            <CardDescription>
              You've successfully signed up. Please confirm your account before signing in to the
              Buildog dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
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
                {loading && <ArrowClockwise />}
                Sign up
              </Button>
              {error && <Label className="text-red-500">{error}</Label>}
              <div></div>
            </div>
          </div>
        </form>
      )}
    </Form>
  );
}
