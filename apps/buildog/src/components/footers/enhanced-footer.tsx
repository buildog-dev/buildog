import Link from "next/link";
import { EnvelopeClosedIcon, ChatBubbleIcon } from "@ui/components/react-icons";

export default function EnhancedFooter() {
  return (
    <footer className="bg-muted py-8 px-4 mt-auto border-t">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Buildog</h3>
            <p className="text-sm text-muted-foreground">
              Take your project a step forward with Buildog.
            </p>
            <div className="flex space-x-4">
              <Link
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <ChatBubbleIcon className="h-5 w-5" />
                <span className="sr-only">Contact</span>
              </Link>
              <Link
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <EnvelopeClosedIcon className="h-5 w-5" />
                <span className="sr-only">Mail</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">About Us</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                Company
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Customers
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Careers
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Offices
              </Link>
            </nav>
          </div>
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                Products
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Partners
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Trials
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Blogs
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Buildog. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
