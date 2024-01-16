"use client";

import * as React from "react";
import { Label } from "@ui/components/label";
import { cn } from "@repo/ui/lib/utils";
import { useRouter } from "next/navigation";
import { Input } from "@ui/components/input";
import { Button } from "@ui/components/button";
import { ReloadIcon } from "@ui/components/react-icons";
import { Auth } from "@/web-sdk";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    const email = event.target[0].value;
    const password = event.target[1].value;

    Auth.authenticate({
      email: email,
      password: password,
    });

    router.push("/blog/");

    setIsLoading(true);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <ReloadIcon />}
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}
