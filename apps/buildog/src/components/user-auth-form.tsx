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
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    const email = event.target[0].value;
    const password = event.target[1].value;

    setLoading(true);
    const authSuccess = await Auth.authenticate({
      email: email,
      password: password,
    });

    if (authSuccess.auth) router.push("/blog/");
    else {
      // show error to user.
      console.log(authSuccess.error);
    }
    setLoading(false);
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
              disabled={loading}
            />
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              disabled={loading}
            />
          </div>
          <Button disabled={loading}>
            {loading && (
              <React.Fragment>
                <ReloadIcon />
                &nbsp;
              </React.Fragment>
            )}
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}
