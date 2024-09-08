export default function getOrganizations() {
  // We will change this with the actual data fetching logic from the backend to get the organization names - Furkan
  // also description should be added to the database - Furkan
  const organizations = [
    { name: "test", id: "org1", description: "this is my first blog organization" },
    { name: "test2", id: "org2", description: "this is my second blog organization" },
    { name: "test3", id: "org3", description: "this is my third blog organization" },
  ];

  return organizations;
}
