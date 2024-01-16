"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
export default function Page() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="mx-auto flex  justify-center items-center min-h-screen">
      <div className="mx-auto flex  flex-col items-center justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            Welcoming Page
          </h1>
        </div>
        <Link className="min-w-[19rem]" href="/login">
          Sign in
        </Link>
      </div>
    </div>
  );
}
