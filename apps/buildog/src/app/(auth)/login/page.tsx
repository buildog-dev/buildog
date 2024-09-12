import { Metadata } from "next";
import { UserAuthForm } from "@/components/user-auth-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">Enter your email below to sign in</p>
      </div>
      <UserAuthForm />
      <div className="flex gap-1 items-center justify-center w-full text-sm text-primary">
        <p> Don't have an account?</p>
        <Link href="/signup" className="underline">
          Sign Up
        </Link>
      </div>
    </>
  );
}
