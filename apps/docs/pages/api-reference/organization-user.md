# Organization User Endpoints

## Overview

This document details the endpoints for managing users within an organization, including adding, updating roles, deleting, and listing users. All endpoints require authentication and appropriate permissions.

---

## 1. Add User to Organization

### **Description**

This endpoint adds a user to an organization.  
It verifies that the authenticated user has sufficient permissions (admin/owner) before adding the user.

### **When to Use**

- To invite or add a user to an organization.
- To assign roles within an organization.

Note: This endpoint is restricted to users with the owner or admin roles, as determined by the JWT token validation.

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
  "organization_id": "org123",
  "user_id": "user456",
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

## 2. Update User Role in Organization

### **Description**

This endpoint updates a user's role in an organization.  
It ensures the authenticated user has admin or owner permissions.

### **When to Use**

- To promote or demote a user's role within an organization.

Note: This endpoint is restricted to users with the owner or admin roles, as determined by the JWT token validation.

### **Endpoint Details**

- **Method:** `PUT`
- **Path:** `/organization-user`
- **Headers:**
  - `Authorization: Bearer <token>` (Required)
  - `organization_id: <organization_id>` (Required)

### **Request Payload**

```json
{
  "user_id": "user456",
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
  "user_id": "user456",
  "role": "admin"
}'
```

---

## 3. Delete User from Organization

### **Description**

This endpoint removes a user from an organization.  
It ensures the authenticated user has admin or owner permissions to perform the operation.

### **When to Use**

- To revoke a user's membership in an organization.

Note: This endpoint is restricted to users with the owner or admin roles, as determined by the JWT token validation.

### **Endpoint Details**

- **Method:** `DELETE`
- **Path:** `/organization-user`
- **Headers:**
  - `Authorization: Bearer <token>` (Required)
  - `organization_id: <organization_id>` (Required)

### **Request Payload**

```json
{
  "user_id": "user456"
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
  "user_id": "user456"
}'
```

---

## 4. Get User Information in Organization

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
  "organization_id": "org123",
  "user_id": "user456",
  "role": "admin",
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z",
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@example.com"
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

## 5. List All Users in an Organization

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
    "user_id": "user456",
    "first_name": "John",
    "last_name": "Doe",
    "role": "admin",
    "email": "john.doe@example.com",
    "created_at": "2024-12-01 10:00:00"
  },
  {
    "user_id": "user789",
    "first_name": "Jane",
    "last_name": "Smith",
    "role": "member",
    "email": "jane.smith@example.com",
    "created_at": "2024-12-02 14:00:00"
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
