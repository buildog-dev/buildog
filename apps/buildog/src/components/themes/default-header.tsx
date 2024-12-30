import { GithubLogo, LinkedinLogo, TwitterLogo } from "@ui/components/react-icons";
import Link from "next/link";

export default function DefaultHeader() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">Buildog</h1>
            </Link>
            <nav className="hidden md:block ml-10"></nav>
          </div>
          <div className="flex items-center space-x-5">
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
          <div className="flex items-center">
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Welcome
                </Link>
              </li>
              <li>
                <Link href="/#" className="text-muted-foreground hover:text-primary">
                  To
                </Link>
              </li>
              <li>
                <Link href="/#" className="text-muted-foreground hover:text-primary">
                  Buildog
                </Link>
              </li>
              <li>
                <Link href="/#" className="text-muted-foreground hover:text-primary">
                  App
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
