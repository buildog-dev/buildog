# **Making Requests From the Frontend**

### Overview

To communicate with the backend API from the frontend, we use the `ServiceClient` class, which ensures that API requests are authenticated and handles all necessary setup such as adding authorization tokens and formatting request bodies.

### **ServiceClient Overview**

The `ServiceClient` class allows you to make authenticated API requests. It abstracts away the complexities of adding authorization headers and serializing request data, simplifying how the frontend communicates with the backend.

The `ServiceClient` class is located at the following path in the repository:

- **Path:** `/packages/web-sdk/serviceClient.ts`
- **GitHub Link:** [ServiceClient on GitHub](https://github.com/buildog-dev/buildog/blob/main/packages/web-sdk/serviceClient.ts)

### **Imports**

To use the `ServiceClient` class, import it along with the `Authenticator` class, which handles retrieving the current user's token. Below is the basic import structure:

```tsx
import { Service } from "@/web-sdk"; // ServiceClient
import { useAuth } from "@/components/auth-provider"; // For authentication
```

### **Making API Requests with `Service.makeAuthenticatedRequest()`**

The `makeAuthenticatedRequest()` method allows you to make authenticated requests to any endpoint. Here’s the basic syntax:

```js
Service.makeAuthenticatedRequest(endpoint, method, data, headers);
```

- **endpoint**: The API endpoint (e.g., `organizations`).
- **method**: The HTTP method (default is `GET`).
- **data**: The request payload (for methods like `POST`, `PUT`, `DELETE`).
- **headers**: Additional headers to include in the request. These will be merged with default headers, such as the Authorization header for Bearer tokens and Content-Type. Use this to send custom headers like `organization_id` when needed.

### **Example API Call**

Here’s an example of how you would call an API to fetch a list of organizations using the `ServiceClient`:

```jsx
// Example: Fetch organizations
const response = await Service.makeAuthenticatedRequest("organizations");
console.log(response);
```

### **Example of a POST Request**

For a `POST` request (e.g., creating a new organization), you would pass the payload as the `data` argument:

```jsx
// Example: Create a new organization
const newOrganization = ;
const response = await Service.makeAuthenticatedRequest("organizations", "POST", null, {
    name: "New Org",
    description: "A new organization"
});
console.log(response);
```

In this implementation:

- The `POST` method is used to send the data to the `organizations` endpoint.
- The request payload contains the details of the new organization to be created.

### **Requests Without Bearer Token**

Here's a simple example of using the ServiceClient to make an API request, such as fetching a list of organizations without requiring user authentication.

```tsx
import React, { useState, useEffect, useCallback } from "react";
import { Service } from "@/web-sdk"; // Import the ServiceClient

export default function OrgList() {
  const [organizations, setOrganizations] = useState([]);

  const getOrganizations = useCallback(async () => {
    try {
      const response = await Service.makeAuthenticatedRequest("organizations");
      if (response) {
        setOrganizations(response);
      }
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
    }
  }, []);

  useEffect(() => {
    getOrganizations();
  }, [getOrganizations]);

  return (
    <div>
      <h2>Organizations</h2>
      <ul>
        {organizations.map((org) => (
          <li key={org.id}>{org.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### **Requests With Bearer Tokenn**

If you are sending a request to an endpoint that requires user authentication with a bearer token, follow the example below. This approach ensures that only authenticated users can make the request while also handling custom headers.

---

```tsx
import React, { useCallback } from "react";
import { Service } from "@/web-sdk";
import { useAuth } from "@/components/auth-provider";

const UpdateUserRole = ({ rowUser, role, organizationId, setUsers, setOpen }) => {
  const { user } = useAuth(); // Retrieves the current authenticated user

  const updateUserRoleHandler = useCallback(async () => {
    // Check for user authentication
    if (!user) {
      alert("Unauthorized: Please log in.");
      return;
    }

    // Validate required data
    if (!rowUser || !rowUser.user_id || !role) {
      alert("Invalid user data or role not selected.");
      return;
    }

    // Ensure valid organization ID
    if (!organizationId || Array.isArray(organizationId)) {
      alert("Invalid organization ID.");
      return;
    }

    try {
      // Make authenticated API request
      const response = await Service.makeAuthenticatedRequest(
        "organization-user", // Endpoint
        "PUT", // HTTP Method
        { user_id: rowUser.user_id, role }, // Request Payload
        { organization_id: organizationId } // Custom Headers
      );

      if (response) {
        alert("User role updated successfully!");
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.user_id === rowUser.user_id ? { ...u, role } : u))
        );
        setOpen(false); // Close any UI modals if necessary
      }
    } catch (error) {
      console.error("Failed to update user role:", error);
      alert("Failed to update user role. Please try again.");
    }
  }, [user, rowUser, role, organizationId, setUsers, setOpen]);

  return (
    <button onClick={updateUserRoleHandler} className="btn btn-primary">
      Update User Role
    </button>
  );
};

export default UpdateUserRole;
```

---

### **Conclusion**

With the `ServiceClient`, making authenticated requests becomes straightforward. By using `Service.makeAuthenticatedRequest()`, you can easily communicate with your API while managing authentication tokens automatically.

For more details or advanced usage, refer to the complete source code for the `ServiceClient` class in the [GitHub repository](https://github.com/buildog-dev/buildog/blob/main/packages/web-sdk/serviceClient.ts).
