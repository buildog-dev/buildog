import Link from "next/link";
import AvatarDropdown from "./avatar-dropdown";

export default function OrganizationsHeader() {
  return (
    <div className="border-b fixed top-0 left-0 right-0 shadow">
      <div className="flex h-16 items-center justify-center px-4 lg:px-6">
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Buildog
          </div>
          <Link
            href="https://docs.buildog.dev"
            target="blank"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Documentation
          </Link>
          <Link
            href="/account/settings/profile"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Settings
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <AvatarDropdown />
        </div>
      </div>
    </div>
  );
}
