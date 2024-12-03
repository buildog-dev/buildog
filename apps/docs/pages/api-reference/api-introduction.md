# **Introduction to Buildog API**

### Overview

Welcome to the **API Reference Documentation** for managing users and organizations. This document provides a detailed guide to all available endpoints, including their purposes, usage scenarios, request and response formats, and example interactions. The API is designed to support common operations related to user and organization management in a secure and efficient manner.

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
  All endpoints require a valid JWT token passed in the `Authorization` header as a Bearer token. Tokens include claims that the API uses to verify the identity and permissions of the user.
  
- **Role-Based Authorization:**  
  Specific actions, such as managing users in an organization, are restricted to users with appropriate roles (`admin`, `owner`).

---

### **API Endpoint Overview**

The API is organized into logical groups to facilitate user and organization management:

1. **User Management**
   - Create a user
   - Retrieve user details
   - Update user information
   - Delete a user

2. **Organization Management**
   - Create an organization
   - Retrieve organization details
   - Add users to an organization
   - Update user roles
   - Remove users from an organization
   - List organization members

---

### **How to Use This Documentation**

Each endpoint is described with the following sections:

- **Description:** Explains the endpoint's purpose and typical use cases.
- **Endpoint Details:** Specifies the HTTP method, path, and required headers.
- **Request Payload:** Describes the format and structure of the request body.
- **Response Format:** Provides examples of successful and error responses.
- **cURL Example:** Demonstrates how to call the endpoint using `cURL`.

This documentation is intended to be a complete guide for developers who need to integrate this API into their applications. By following the examples and reference materials provided, developers can ensure seamless implementation and robust integration.