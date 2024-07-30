"use client";

import { Button } from "@ui/components/button";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();

  return (
    <div className="mx-auto flex justify-center items-center min-h-screen">
      <div className="mx-auto flex  flex-col items-center justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">Welcoming Page</h1>
        </div>
        <Button className="min-w-[19rem]" onClick={() => router.push("/login")}>
          Sign in
        </Button>
      </div>
    </div>
  );
}
