import Link from "next/link";
import { EnvelopeClosedIcon, ChatBubbleIcon } from "@ui/components/react-icons";

export default function LinksCenterFooter() {
  return (
    <footer className="bg-muted py-6 px-4 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-black mb-4 md:mb-0">
          © {new Date().getFullYear()} Buildog. All rights reserved.
        </div>
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Link
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <EnvelopeClosedIcon className="h-5 w-5" />
            <span className="sr-only">Mail</span>
          </Link>
          <Link
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <ChatBubbleIcon className="h-5 w-5" />
            <span className="sr-only">Contact With Me</span>
          </Link>
        </div>
        <nav className="flex flex-col md:flex-row gap-4 md:gap-6">
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
