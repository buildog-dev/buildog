"use client";

import { Service } from "@/web-sdk";
import { CaretUpDown, Check, PlusCircle } from "@ui/components/react-icons";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@ui/components/sidebar";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./auth-provider";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/components/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@ui/components/command";
import { cn } from "@ui/lib/utils";
import Link from "next/link";

type Organization = {
  organization_description: string;
  organization_id: string;
  organization_name: string;
};

const SidebarOrganizationSelect = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const { organizationId } = useParams() as {
    organizationId: string;
  };

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

  const filteredOrganizations = !!searchTerm
    ? organizations.filter((org) =>
        org.organization_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : organizations;

  const handleSelectOrganization = (newOrganizationId: string) => {
    const newPath = pathname.replace(organizationId, newOrganizationId);
    router.push(newPath);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <SidebarMenuButton aria-expanded={open} className="w-full justify-between" size="lg">
              {currentOrganization ? (
                <>
                  <Avatar className="relative flex items-center justify-center shrink-0 overflow-hidden rounded-full size-8">
                    <AvatarImage
                      className="aspect-square grayscale size-6 rounded-full"
                      src="https://avatar.vercel.sh/acme-inc.png"
                      alt={currentOrganization.organization_name}
                    />
                    <AvatarFallback>
                      {currentOrganization.organization_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-1 mr-auto">{currentOrganization.organization_name}</div>
                </>
              ) : (
                "Select Organization"
              )}
              <CaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-full p-0"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search organization..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                {filteredOrganizations.length === 0 && (
                  <CommandEmpty>
                    {searchTerm
                      ? `There is no match for "${searchTerm}".`
                      : "No organization found."}
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
                        onSelect={() => handleSelectOrganization(org.organization_id)}
                        className={cn(
                          "cursor-pointer",
                          org.organization_id === currentOrganization.organization_id && "font-bold"
                        )}
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
              <CommandSeparator />
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarOrganizationSelect;
