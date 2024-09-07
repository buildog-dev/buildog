import Link from "next/link";

export default function SimplicityHeader() {
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
