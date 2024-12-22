export type Organization = {
  id: string;
  name: string;
  description: string;
  created_by: string;
};

export type OrganizationUser = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
};
