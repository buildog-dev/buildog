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

### **Basic Usage**

Here's a basic example of how to use the `ServiceClient` to make an authenticated API request, such as fetching a list of organizations.

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

### **Making API Requests with `Service.makeAuthenticatedRequest()`**

The `makeAuthenticatedRequest()` method allows you to make authenticated requests to any endpoint. Here’s the basic syntax:

```js
Service.makeAuthenticatedRequest(endpoint, method, data, headers);
```

- **endpoint**: The API endpoint (e.g., `"organizations"`).
- **method**: The HTTP method (default is `"GET"`).
- **data**: The request payload (for methods like POST, PUT, DELETE).

### **Example API Call**

Here’s an example of how you would call an API to fetch a list of organizations using the `ServiceClient`:

```jsx
// Example: Fetch organizations
const response = await Service.makeAuthenticatedRequest("organizations");
console.log(response);
```

### **Example of a POST Request**

For a POST request (e.g., creating a new organization), you would pass the payload as the `data` argument:

```jsx
// Example: Create a new organization
const newOrganization = ;
const response = await Service.makeAuthenticatedRequest("organizations", "POST", null, {
    name: "New Org",
    description: "A new organization"
});
console.log(response);
```

In this example:

- The `POST` method is used to send the data to the `organizations` endpoint.
- The request payload contains the details of the new organization to be created.

---

### **Conclusion**

With the `ServiceClient`, making authenticated requests becomes straightforward. By using `Service.makeAuthenticatedRequest()`, you can easily communicate with your API while managing authentication tokens automatically.

For more details or advanced usage, refer to the complete source code for the `ServiceClient` class in the [GitHub repository](https://github.com/buildog-dev/buildog/blob/main/packages/web-sdk/serviceClient.ts).

---

This version covers the essential parts, explaining the imports, basic usage, and how to make requests with `Service.makeAuthenticatedRequest()`. It also links to the full code on GitHub for developers who want to explore the complete `ServiceClient` implementation.
