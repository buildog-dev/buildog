# Organization Endpoints

## Overview

This document provides details on the Organization Management endpoints, their functionality, expected use cases, and examples for integration with tools like cURL.

---

## **1. `getOrganizationsHandler`**

### **Description**

This endpoint retrieves all organizations associated with the authenticated user.  
It validates the user's token and fetches the organizations from the database.

### **When to Use**

- To list the organizations that a user is associated with.
- To display an overview of the user's organizations in a dashboard.

### **Endpoint Details**

- **Method:** `GET`
- **Path:** `/organizations`
- **Headers:**
  - `Authorization: Bearer <token>` (Required)

### **Response**

- **Success (200 OK):**

```json
[
  {
    "id": "org123",
    "name": "Organization One",
    "description": "Description of Organization One",
    "created_by": "user123",
    "created_at": "2024-12-01T10:00:00Z"
  },
  {
    "id": "org456",
    "name": "Organization Two",
    "description": "Description of Organization Two",
    "created_by": "user123",
    "created_at": "2024-12-02T14:00:00Z"
  }
]
```

- **Error Responses:**
  - `401 Unauthorized`: Token claims missing or invalid.
  - `400 Bad Request`: Invalid user ID.
  - `500 Internal Server Error`: Failed to retrieve organizations.

### **cURL Example**

```bash
curl -X GET http://localhost:3010/api/organizations \
-H "Authorization: Bearer <token>"
```

---

## **2. `createOrganizationHandler`**

### **Description**

This endpoint creates a new organization.  
It validates the user's token, processes the request payload, and saves the organization to the database. It also assigns the authenticated user as the owner of the organization.

### **When to Use**

- When a new organization needs to be created.
- When a user wants to establish a group or workspace.

### **Endpoint Details**

- **Method:** `POST`
- **Path:** `/organizations`
- **Headers:**
  - `Authorization: Bearer <token>` (Required)

### **Request Payload**

```json
{
  "organization_name": "New Organization",
  "organization_description": "This is a description of the new organization."
}
```

### **Response**

- **Success (201 Created):**

```json
{
  "organization_id": "org789",
  "user_id": "user123",
  "role": "owner"
}
```

- **Error Responses:**
  - `401 Unauthorized`: Token claims missing or invalid.
  - `400 Bad Request`: Invalid request body or user ID.
  - `500 Internal Server Error`: Failed to create organization.

### **cURL Example**

```bash
curl -X POST http://localhost:3010/api/organizations \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "organization_name": "New Organization",
  "organization_description": "This is a description of the new organization."
}'
```
