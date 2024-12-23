import Link from "next/link";
import AvatarDropdown from "./avatar-dropdown";

export default function OrganizationsHeader() {
  return (
    <div className="border-b fixed top-0 left-0 right-0 shadow">
      <div className="flex h-16 items-center justify-center px-4 lg:px-6">
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <div className="relative z-20 flex items-center text-lg font-medium">Buildog</div>
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
