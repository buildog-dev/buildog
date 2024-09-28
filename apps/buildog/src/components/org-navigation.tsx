import * as React from "react";
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
import getOrganizations from "@/lib/get-organizations";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const personalAccounts = [
  { id: 1, name: "John Doe", avatarUrl: "https://avatar.vercel.sh/john-doe.png" },
  { id: 2, name: "Jane Smith", avatarUrl: "https://avatar.vercel.sh/jane-smith.png" },
];

export default function OrgNavigation() {
  const params = useParams();
  const { organizationId } = params;

  const organizations = getOrganizations();

  const currentOrganization = organizations.find((org) => org.id === organizationId);

  const router = useRouter();

  const handleOrganizationChange = (organizationId: string) => {
    router.push(`/organizations/${organizationId}`);
  };

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedOrg, setSelectedOrg] = React.useState(currentOrganization);
  const [selectedAccount, setSelectedAccount] = React.useState(personalAccounts[0]);

  const filteredOrganizations = searchTerm
    ? organizations.filter((org) => org.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : organizations;

  const filteredPersonalAccounts = searchTerm
    ? personalAccounts.filter((account) =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : personalAccounts;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedOrg ? (
            <>
              <Avatar className="relative flex shrink-0 overflow-hidden rounded-full mr-2 h-5 w-5">
                <AvatarImage
                  className="aspect-square h-full w-full grayscale"
                  src="https://avatar.vercel.sh/acme-inc.png"
                  alt={selectedOrg.name}
                />
                <AvatarFallback>{selectedOrg.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-1 mr-auto">{selectedOrg.name}</div>
            </>
          ) : selectedAccount ? (
            <>
              <Avatar className="relative flex shrink-0 overflow-hidden rounded-full mr-2 h-5 w-5">
                <AvatarImage
                  className="aspect-square h-full w-full grayscale"
                  src={selectedAccount.avatarUrl}
                  alt={selectedAccount.name}
                />
                <AvatarFallback>{selectedAccount.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-1 mr-auto">{selectedAccount.name}</div>
            </>
          ) : (
            "Select Organization"
          )}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search organization..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>No account or organization found.</CommandEmpty>
            {filteredPersonalAccounts.length > 0 && (
              <CommandGroup>
                <div className="pl-3 pr-3 font-medium text-zinc-400 text-xs pt-2 pb-2">
                  Personal Account
                </div>
                {filteredPersonalAccounts.map((account) => (
                  <CommandItem
                    key={account.id}
                    onSelect={() => {
                      setSelectedAccount(account);
                      setSelectedOrg(null);
                      setValue(account.id.toString() === value ? "" : account.id.toString());
                      setOpen(false);
                    }}
                  >
                    <Avatar className="relative flex shrink-0 overflow-hidden rounded-full mr-2 h-5 w-5">
                      <AvatarImage
                        className="aspect-square h-full w-full grayscale"
                        src={account.avatarUrl}
                        alt={account.name}
                      />
                      <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {account.name}
                    <CheckIcon
                      className={cn(
                        "mr-0 ml-auto h-4 w-4",
                        selectedAccount?.id === account.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {filteredOrganizations.length > 0 && (
              <CommandGroup>
                <div className="pl-3 pr-3 font-medium text-zinc-400 text-xs pt-2 pb-2">Teams</div>
                {filteredOrganizations.map((org) => (
                  <CommandItem
                    key={org.id}
                    onSelect={() => {
                      setSelectedOrg(org);
                      setSelectedAccount(null);
                      setValue(org.id.toString() === value ? "" : org.id.toString());
                      handleOrganizationChange(org.id.toString());
                      setOpen(false);
                    }}
                    className={`cursor-pointer ${org.id === currentOrganization?.id ? "font-bold" : ""}`}
                  >
                    <Avatar className="relative flex shrink-0 overflow-hidden rounded-full mr-2 h-5 w-5">
                      <AvatarImage
                        className="aspect-square h-full w-full grayscale"
                        src="https://avatar.vercel.sh/acme-inc.png"
                        alt={org.name}
                      />
                      <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {org.name}
                    <CheckIcon
                      className={cn(
                        "mr-0 ml-auto h-4 w-4",
                        selectedOrg?.id === org.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            <DropdownMenuSeparator />
            <CommandItem
              onSelect={(currentValue) => {
                setValue(currentValue === value ? "" : currentValue);
                setOpen(false);
              }}
            >
              <Link href={"/organizations"} className="flex items-center py-1">
                <PlusCircledIcon className="ml-1.5 h-5 w-5" />
                <span className="ml-2">Create Organization</span>
              </Link>
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
