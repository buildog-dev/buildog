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
  params: { organizationId: string };
}) {
  const { organizationId } = params;

  return (
    <div className="flex w-full">
      <Sidebar className="w-[300px] border-r" organizationId={organizationId} />
      <div className="flex flex-col w-full">
        <Appbar />
        <div className="flex-grow p-5 mx-auto overflow-auto w-full">{children}</div>
      </div>
    </div>
  );
}
