# **Introduction to Buildog API**

### Overview

Welcome to the Buildog API reference documentation! This API provides a comprehensive interface for interacting with Buildog's core backend services, enabling developers to manage organizations, users, and related data efficiently.

The API is written in **Go**, ensuring high performance and scalability. For additional insights about our backend, visit the [source code repository](https://github.com/buildog-dev/buildog/tree/main/apps/api).

Explore this documentation to understand the endpoints, their usage, and how to integrate them into your application.

---

### Base URL

All API requests should be made to the following base URL unless otherwise specified:

```bash
http://localhost:3010
```

---

### **Purpose of the API**

This API enables seamless integration with your applications to manage users and organizations efficiently. It supports the following key functionalities:

- **User Management:**  
  Create, retrieve, update, and delete users within the system.
- **Organization Management:**  
  Create organizations, retrieve organization details, and manage users within an organization.

- **Access Control:**  
  Role-based access control (RBAC) ensures that only authorized users can perform sensitive operations.

---

### **Authentication and Authorization**

- **Token-Based Authentication:**
  All endpoints require a valid JWT token passed in the Authorization header as a Bearer token. Tokens include claims that the API uses to verify the identity and permissions of the user. If you'd like to learn more about how tokens are generated, refer to the [Authentication Guide](../getting-started/authentication.md).
- **Role-Based Authorization:**  
  Specific actions, such as managing users in an organization, are restricted to users with appropriate roles (`admin`, `owner`).

---

### **API Endpoint Overview**

The API is organized into logical groups to facilitate user and organization management:

Here’s the table with a bulleted list in the right column:

| **Endpoints**         | **Operations**                                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **user**              | • Create<br>• Get<br>• Update<br>• Delete                                                                                   |
| **organization**      | • Create<br>• Get                                                                                                           |
| **organization-user** | • Add users to an organization<br>• Remove users from an organization<br>• Update user roles<br>• List organization members |

---

### **How to Use This Documentation**

Each endpoint is described with the following sections:

- **Description:** Explains the endpoint's purpose and typical use cases.
- **Endpoint Details:** Specifies the HTTP method, path, and required headers.
- **Request Payload:** Describes the format and structure of the request body.
- **Response Format:** Provides examples of successful and error responses.
- **cURL Example:** Demonstrates how to call the endpoint using `cURL`.

This documentation is intended to be a complete guide for developers who need to integrate this API into their applications. By following the examples and reference materials provided, developers can ensure seamless implementation and robust integration.
