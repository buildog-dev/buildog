"use client";
import { File, GithubLogo, LinkedinLogo, TwitterLogo } from "@ui/components/react-icons";
import Link from "next/link";

export default function LinksCenterHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="#" className="flex items-center" prefetch={false}>
          <File className="h-6 w-6" />
          <span className="ml-2 font-bold text-lg">Blog</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Blog
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
            <TwitterLogo className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
            <GithubLogo className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
            <LinkedinLogo className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
