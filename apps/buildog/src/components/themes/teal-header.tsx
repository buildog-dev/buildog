"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";

export default function TealHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-teal-800 border-b border-gray-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <Link href="/#" className="text-3xl font-bold text-white">
            Buildog
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              href="/#"
              className="text-white text-muted-foreground hover:text-primary transition-colors"
            >
              Welcome
            </Link>

            <Link
              href="/#"
              className="text-white text-muted-foreground hover:text-primary transition-colors"
            >
              To
            </Link>
            <Link
              href="/#"
              className="text-white text-muted-foreground hover:text-primary transition-colors"
            >
              Buildog
            </Link>
            <Link
              href="/#"
              className="text-white text-muted-foreground hover:text-primary transition-colors"
            >
              App
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
