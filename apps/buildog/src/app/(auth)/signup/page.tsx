"use client";
import { metadata } from "../metadata";
import { SignUpForm } from "@/components/user-sign-up-form";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/login");
  };
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">Enter your email below to sign in</p>
      </div>
      <SignUpForm />
      <div className="text-center mt-4">
        Already have an account?{" "}
        <button onClick={handleLoginRedirect} className="text-blue-500 hover:underline">
          Login
        </button>
      </div>
    </>
  );
}
