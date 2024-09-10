import { DashboardIcon } from "@ui/components/ui/react-icons";
import { useParams, useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
  } from "@ui/components/ui/dropdown-menu";
import { Button } from "@ui/components/button";
import getOrganizations from "@/lib/get-organizations";


const OrgNavigation = () => {
    const params = useParams()
    const { organizationId } = params;

  const organizations = getOrganizations();

  const currentOrganization = organizations.find((org) => org.id === organizationId);

    const router = useRouter();

    const handleOrganizationChange = (organizationId) => {
        router.push(`/organizations/${organizationId}`);
      };
    
      const goToOrganizationsHome = () => {
        router.push("/organizations");
      };

    return (
        <div className="flex items-center">
          <button
            onClick={goToOrganizationsHome}
            className="p-2 mr-5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Go to organizations"
          >
            <DashboardIcon className="w-6 h-6 text-black dark:text-white" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="text-lg font-semibold cursor-pointer py-2 px-4 rounded-md transition-colors duration-200"
                aria-label="Select organization"
              >
                {currentOrganization?.name ?? "Select Organization"}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="min-w-[200px]">
              {organizations.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleOrganizationChange(org.id)}
                  className={`cursor-pointer ${
                    org.id === currentOrganization?.id ? "font-bold" : ""
                  }`}
                >
                  {org.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
    )
}

export default OrgNavigation;