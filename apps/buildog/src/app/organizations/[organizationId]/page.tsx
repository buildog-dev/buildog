export default function Page({ params }: { params: { organizationId: string } }) {
  const { organizationId } = params;

  return (
    <div>
      <h1>Organization id: {organizationId}</h1>
      <p>This is the overview page for the organization.</p>
    </div>
  );
}
