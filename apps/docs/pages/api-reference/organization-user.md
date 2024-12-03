# Organization User Endpoints

## Overview

This document details the endpoints for managing users within an organization, including adding, updating roles, deleting, and listing users. All endpoints require authentication and appropriate permissions.

---

## **1. `addUserToOrganization`**

### **Description**

This endpoint adds a user to an organization.  
It verifies that the authenticated user has sufficient permissions (admin/owner) before adding the user.

### **When to Use**

- To invite or add a user to an organization.
- To assign roles within an organization.

### **Endpoint Details**

- **Method:** `POST`
- **Path:** `/organization-user`
- **Headers:**  
  - `Authorization: Bearer <token>` (Required)  
  - `organization_id: <organization_id>` (Required)

### **Request Payload**

```json
{
  "email": "user@example.com",
  "role": "member"
}
```

### **Response**

- **Success (201 Created):**

```json
{
  "organizationId": "org123",
  "userId": "user456",
  "role": "member"
}
```

- **Error Responses:**
  - `401 Unauthorized`: Token claims missing or invalid.
  - `403 Forbidden`: Insufficient permissions.
  - `400 Bad Request`: Invalid request payload or organization ID.
  - `500 Internal Server Error`: Failed to add user.

### **cURL Example**

```bash
curl -X POST http://localhost:3010/organization-user \
-H "Authorization: Bearer <token>" \
-H "organization_id: org123" \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "role": "member"
}'
```

---

## **2. `updateUserRoleInOrganization`**

### **Description**

This endpoint updates a user's role in an organization.  
It ensures the authenticated user has admin or owner permissions.

### **When to Use**

- To promote or demote a user's role within an organization.

### **Endpoint Details**

- **Method:** `PUT`
- **Path:** `/organization-user`
- **Headers:**  
  - `Authorization: Bearer <token>` (Required)  
  - `organization_id: <organization_id>` (Required)

### **Request Payload**

```json
{
  "userId": "user456",
  "role": "admin"
}
```

### **Response**

- **Success (200 OK):**

```json
{
  "message": "User role updated successfully"
}
```

- **Error Responses:**
  - `401 Unauthorized`: Token claims missing or invalid.
  - `403 Forbidden`: Insufficient permissions.
  - `400 Bad Request`: Invalid request payload.
  - `404 Not Found`: User not found in the organization.
  - `500 Internal Server Error`: Failed to update role.

### **cURL Example**

```bash
curl -X PUT http://localhost:3010/organization-user \
-H "Authorization: Bearer <token>" \
-H "organization_id: org123" \
-H "Content-Type: application/json" \
-d '{
  "userId": "user456",
  "role": "admin"
}'
```

---

## **3. `deleteUserFromOrganization`**

### **Description**

This endpoint removes a user from an organization.  
It ensures the authenticated user has admin or owner permissions to perform the operation.

### **When to Use**

- To revoke a user's membership in an organization.

### **Endpoint Details**

- **Method:** `DELETE`
- **Path:** `/organization-user`
- **Headers:**  
  - `Authorization: Bearer <token>` (Required)  
  - `organization_id: <organization_id>` (Required)

### **Request Payload**

```json
{
  "userId": "user456"
}
```

### **Response**

- **Success (200 OK):**

```json
{
  "message": "User deleted from organization successfully"
}
```

- **Error Responses:**
  - `401 Unauthorized`: Token claims missing or invalid.
  - `403 Forbidden`: Insufficient permissions.
  - `400 Bad Request`: Invalid request payload or organization ID.
  - `404 Not Found`: User not found in the organization.
  - `500 Internal Server Error`: Failed to delete user.

### **cURL Example**

```bash
curl -X DELETE http://localhost:3010/organization-user \
-H "Authorization: Bearer <token>" \
-H "organization_id: org123" \
-H "Content-Type: application/json" \
-d '{
  "userId": "user456"
}'
```

---

## **4. `getOrganizationUserInfo`**

### **Description**

This endpoint retrieves detailed information about a specific user in an organization.  
It requires the `user_id` to be provided in the path.

### **When to Use**

- To view a user's role and details within an organization.

### **Endpoint Details**

- **Method:** `GET`
- **Path:** `/organization-user/{user_id}`
- **Headers:**  
  - `Authorization: Bearer <token>` (Required)  
  - `organization_id: <organization_id>` (Required)

### **Response**

- **Success (200 OK):**

```json
{
  "userId": "user456",
  "organizationId": "org123",
  "role": "admin",
  "joinedAt": "2024-12-01T10:00:00Z"
}
```

- **Error Responses:**
  - `401 Unauthorized`: Token claims missing or invalid.
  - `403 Forbidden`: Insufficient permissions.
  - `400 Bad Request`: User ID missing.
  - `404 Not Found`: User not found in the organization.
  - `500 Internal Server Error`: Failed to retrieve user information.

### **cURL Example**

```bash
curl -X GET http://localhost:3010/organization-user/user456 \
-H "Authorization: Bearer <token>" \
-H "organization_id: org123"
```

---

## **5. `listOrganizationUsers`**

### **Description**

This endpoint lists all users in an organization.

### **When to Use**

- To retrieve all users associated with an organization.
- To display a user directory or manage members.

### **Endpoint Details**

- **Method:** `GET`
- **Path:** `/organization-user`
- **Headers:**  
  - `Authorization: Bearer <token>` (Required)  
  - `organization_id: <organization_id>` (Required)

### **Response**

- **Success (200 OK):**

```json
[
  {
    "userId": "user456",
    "organizationId": "org123",
    "role": "admin",
    "joinedAt": "2024-12-01T10:00:00Z"
  },
  {
    "userId": "user789",
    "organizationId": "org123",
    "role": "member",
    "joinedAt": "2024-12-02T14:00:00Z"
  }
]
```

- **Error Responses:**
  - `401 Unauthorized`: Token claims missing or invalid.
  - `400 Bad Request`: Organization ID missing.
  - `500 Internal Server Error`: Failed to list users.

### **cURL Example**

```bash
curl -X GET http://localhost:3010/organization-user \
-H "Authorization: Bearer <token>" \
-H "organization_id: org123"
```