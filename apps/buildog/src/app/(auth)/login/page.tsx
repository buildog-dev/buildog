"use client";
import { metadata } from "../metadata";
import { UserAuthForm } from "@/components/user-auth-form";
import { useRouter } from "next/navigation";

export default function AuthenticationPage() {
  const router = useRouter();

  const handleSignUpRedirect = () => {
    router.push("/signup");
  };
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">Enter your email below to sign in</p>
      </div>
      <UserAuthForm />
      <div className="text-center mt-4">
        Don't have an account?{" "}
        <button onClick={handleSignUpRedirect} className="text-blue-500 hover:underline">
          Sign Up
        </button>
      </div>
    </>
  );
}
