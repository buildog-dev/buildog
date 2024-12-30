import React, { useState, useCallback, useEffect } from "react";
import { Check, CaretUpDown, PlusCircle } from "@ui/components/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/components/command";
import { DropdownMenuSeparator } from "@ui/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/components/popover";
import { useRouter, useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Service } from "@/web-sdk";
import { useAuth } from "@/components/auth-provider";

export default function OrgNavigation() {
  const [organizations, setOrganizations] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useAuth();
  const params = useParams();
  const { organizationId } = params;
  const router = useRouter();
  const pathname = usePathname();

  const getOrganizations = useCallback(async () => {
    const response = await Service.makeAuthenticatedRequest("organizations");
    if (response) {
      setOrganizations(response);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    getOrganizations();
  }, [user, getOrganizations]);

  const currentOrganization = organizations.find((org) => org.organization_id === organizationId);

  const filteredOrganizations = searchTerm
    ? organizations.filter((org) =>
        org.organization_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : organizations;

  const handleOrganizationRouteChange = (newOrganizationId: string) => {
    if (typeof organizationId === "string") {
      const newPath = pathname.replace(organizationId, newOrganizationId);
      router.push(newPath);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {currentOrganization ? (
            <>
              <Avatar className="relative flex shrink-0 overflow-hidden rounded-full mr-2 h-5 w-5">
                <AvatarImage
                  className="aspect-square h-full w-full grayscale"
                  src="https://avatar.vercel.sh/acme-inc.png"
                  alt={currentOrganization.organization_name}
                />
                <AvatarFallback>{currentOrganization.organization_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-1 mr-auto">{currentOrganization.organization_name}</div>
            </>
          ) : (
            "Select Organization"
          )}
          <CaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search organization..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {filteredOrganizations.length === 0 && (
              <CommandEmpty>
                {searchTerm ? `There is no match for "${searchTerm}".` : "No organization found."}
              </CommandEmpty>
            )}
            {filteredOrganizations.length > 0 && (
              <CommandGroup>
                <div className="pl-3 pr-3 font-medium text-zinc-400 text-xs pt-2 pb-2">
                  Organizations
                </div>
                {filteredOrganizations.map((org) => (
                  <CommandItem
                    key={org.organization_id}
                    value={org.organization_id}
                    onSelect={() => handleOrganizationRouteChange(org.organization_id)}
                    className={`cursor-pointer ${org.organization_id === currentOrganization?.organization_id ? "font-bold" : ""}`}
                  >
                    <Avatar className="relative flex shrink-0 overflow-hidden rounded-full mr-2 h-5 w-5">
                      <AvatarImage
                        className="aspect-square h-full w-full grayscale"
                        src="https://avatar.vercel.sh/acme-inc.png"
                        alt={org.organization_name}
                      />
                      <AvatarFallback>{org.organization_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {org.organization_name}
                    <Check
                      className={cn(
                        "mr-0 ml-auto h-4 w-4",
                        currentOrganization?.organization_id === org.organization_id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
          <DropdownMenuSeparator />
          <Link
            href="/organizations"
            className="flex items-center py-1 px-1 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white"
          >
            <PlusCircle className="ml-1.5 h-5 w-5" />
            <span className="ml-2">Create Organization</span>
          </Link>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
