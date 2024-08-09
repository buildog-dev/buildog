"use client";

import * as React from "react";
import { Label } from "@ui/components/label";
import { cn } from "@repo/ui/lib/utils";
import { useRouter } from "next/navigation";
import { Input } from "@ui/components/input";
import { Button } from "@ui/components/button";
import { ReloadIcon } from "@ui/components/react-icons";
import { signUpService } from "@/web-sdk";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignUpForm({ className, ...props }: UserAuthFormProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;

    if (!email || !password || !first_name || !last_name) {
      console.error("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Please enter a valid email");
      return;
    }

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
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="first_name">
              First Name
            </Label>
            <Input
              id="first_name"
              name="first_name"
              placeholder="First Name"
              type="text"
              autoCapitalize="none"
              autoComplete="first_name"
              autoCorrect="off"
              disabled={loading}
            />
            <Label className="sr-only" htmlFor="last_name">
              Last Name
            </Label>
            <Input
              id="last_name"
              name="last_name"
              placeholder="Last Name"
              type="text"
              autoCapitalize="none"
              autoComplete="last_name"
              autoCorrect="off"
              disabled={loading}
            />
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={loading}
            />
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="password"
              type="password"
              disabled={loading}
            />
          </div>
          <Button disabled={loading}>
            {loading && <ReloadIcon />}
            Sign up
          </Button>
        </div>
      </form>
    </div>
  );
}
