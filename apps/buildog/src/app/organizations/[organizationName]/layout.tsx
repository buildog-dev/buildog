import Appbar from "@/components/app-bar";
import { Sidebar } from "@/components/sidebar";
import getOrganizations from "@/lib/get-organizations";

export async function generateStaticParams() {
  const organizations = getOrganizations();

  // Return an array of objects with the dynamic parameters
  return organizations.map((org) => ({
    organizationName: org.name,
    organizationId: org.id,
  }));
}

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { organizationName: string };
}) {
  const { organizationName } = params;

  return (
    <div className="flex w-full">
      {/* Pass organizationName to Sidebar */}
      <Sidebar className="w-[300px] border-r" organizationName={organizationName} />
      <div className="flex flex-col w-full">
        <Appbar />
        <div className="flex-grow p-5 mx-auto overflow-auto w-full">
          {/* Render the children (nested pages) */}
          {children}
        </div>
      </div>
    </div>
  );
}
