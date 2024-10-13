import React, { useState, useCallback, useEffect } from "react";
import { CheckIcon, CaretSortIcon, PlusCircledIcon } from "@ui/components/react-icons";
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
import { useRouter, useParams } from "next/navigation";
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

  const currentOrganization = organizations.find((org) => org.OrganizationId === organizationId);

  const filteredOrganizations = searchTerm
    ? organizations.filter((org) =>
        org.OrganizationName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : organizations;

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
                  alt={currentOrganization.OrganizationName}
                />
                <AvatarFallback>{currentOrganization.OrganizationName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-1 mr-auto">{currentOrganization.OrganizationName}</div>
            </>
          ) : (
            "Select Organization"
          )}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                    key={org.OrganizationId}
                    value={org.OrganizationId.toString()}
                    onSelect={() => {
                      router.push(`/organizations/${org.OrganizationId}`);
                      setOpen(false);
                    }}
                    className={`cursor-pointer ${org.OrganizationId === currentOrganization?.OrganizationId ? "font-bold" : ""}`}
                  >
                    <Avatar className="relative flex shrink-0 overflow-hidden rounded-full mr-2 h-5 w-5">
                      <AvatarImage
                        className="aspect-square h-full w-full grayscale"
                        src="https://avatar.vercel.sh/acme-inc.png"
                        alt={org.OrganizationName}
                      />
                      <AvatarFallback>{org.OrganizationName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {org.OrganizationName}
                    <CheckIcon
                      className={cn(
                        "mr-0 ml-auto h-4 w-4",
                        currentOrganization?.OrganizationId === org.OrganizationId
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
            <PlusCircledIcon className="ml-1.5 h-5 w-5" />
            <span className="ml-2">Create Organization</span>
          </Link>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
