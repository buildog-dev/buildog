import Link from "next/link";

export default function CyanHeader() {
  return (
    <header className="bg-cyan-900 border-b border-gray-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <Link href="/" className="text-2xl font-bold text-white transition-colors">
            Buildog
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="text-white transition-colors">
                  Welcome
                </Link>
              </li>
              <li>
                <Link href="/#" className="text-white transition-colors">
                  To
                </Link>
              </li>
              <li>
                <Link href="/#" className="text-white transition-colors">
                  Buildog
                </Link>
              </li>
              <li>
                <Link href="/#" className="text-white transition-colors">
                  App
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
