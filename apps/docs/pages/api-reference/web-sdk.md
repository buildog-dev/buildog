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
```

### **Using `Service` to Make Requests**

The `makeAuthenticatedRequest()` method allows you to make authenticated requests to any endpoint. Here’s the basic syntax:

```js
Service.makeAuthenticatedRequest(endpoint, method, data, headers);
```

- **endpoint**: The API endpoint (e.g., `organizations`).
- **method**: The HTTP method (default is `GET`).
- **data**: The request payload (for methods like `POST`, `PUT`, `DELETE`).
- **headers**: Additional headers to include in the request. These will be merged with default headers, such as the Authorization header for Bearer tokens and Content-Type. Use this to send custom headers like `organization_id` when needed.

### **Example of a GET Request**

Here’s an example of how you would call an API to fetch a list of organizations using the `ServiceClient`:

```jsx
// Example: Fetch organizations
const response = await Service.makeAuthenticatedRequest("organizations");
```

### **Example of a POST Request**

For a `POST` request (e.g., creating a new organization), you would pass the payload as the `data` argument:

```jsx
// Example: Create a new organization
const response = await Service.makeAuthenticatedRequest("organizations", "POST", null, {
    name: "New Org",
    description: "A new organization"
});
```

In this implementation:

- The `POST` method is used to send the data to the `organizations` endpoint.
- The request payload contains the details of the new organization to be created.

### **Conclusion**

With the `ServiceClient`, making authenticated requests becomes straightforward. By using `Service.makeAuthenticatedRequest()`, you can easily communicate with your API while managing authentication tokens automatically.

For more details or advanced usage, refer to the complete source code for the `ServiceClient` class in the [GitHub repository](https://github.com/buildog-dev/buildog/blob/main/packages/web-sdk/serviceClient.ts).
