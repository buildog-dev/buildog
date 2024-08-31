export default function Page({ params }: { params: { organizationName: string } }) {
  const { organizationName } = params;

  return (
    <div>
      <h1>Organization Name: {organizationName}</h1>
      <p>This is the overview page for the organization.</p>
    </div>
  );
}
