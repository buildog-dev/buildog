import { InstagramLogo, TwitterLogo, LinkedinLogo } from "@ui/components/react-icons";
import Link from "next/link";

export default function NameCenterHeader() {
  return (
    <header className="bg-background px-4 py-3 shadow-sm sm:px-6 md:py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
            <TwitterLogo className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
            <LinkedinLogo className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
            <InstagramLogo className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </Link>
        </div>
        <Link href="#" className="text-2xl font-bold tracking-tight" prefetch={false}>
          The Blog
        </Link>
        <nav className="hidden space-x-4 md:flex">
          <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
            Blog
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
            About
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
