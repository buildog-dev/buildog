# User Endpoints

## Overview

This document provides details on the User Management endpoints, their functionality, expected use cases, and examples for integration with tools like cURL and Postman.

---

## **1. `createUserHandler`**

### **Description**

This endpoint is used to create a new user in the system.  
It extracts the user ID from the request token, validates the request payload, and saves a new user to the database.

### **When to Use**

- When a new user account needs to be created in the system.
- When the authenticated user submits their profile details for account creation.

### **Endpoint Details**

- **Method:** `POST`
- **Path:** `/users`
- **Headers:**
  - `Authorization: Bearer <token>` (Required)

### **Request Payload**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com"
}
```

### **Response**

- **Success (201 Created):**

```json
{
  "success": true,
  "message": "User created successfully"
}
```

- **Error Responses:**
  - `401 Unauthorized`: Token claims missing or invalid.
  - `400 Bad Request`: Invalid request body.
  - `500 Internal Server Error`: Failed to create user.

### **cURL Example**

```bash
curl -X POST http://localhost:3010/api/users \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com"
}'
```

---

## **2. `getUserHandler`**

### **Description**

This endpoint retrieves the details of the authenticated user.  
It validates the user's token and fetches the user's information from the database using their ID.

### **When to Use**

- To fetch user profile information after authentication.
- When displaying a user's account details in a dashboard.

### **Endpoint Details**

- **Method:** `GET`
- **Path:** `/users`
- **Headers:**
  - `Authorization: Bearer <token>` (Required)

### **Response**

- **Success (200 OK):**

```json
{
  "id": "12345",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

- **Error Responses:**
  - `401 Unauthorized`: Token claims missing or invalid.
  - `400 Bad Request`: Invalid user ID.
  - `500 Internal Server Error`: Failed to retrieve user.

### **cURL Example**

```bash
curl -X GET http://localhost:3010/api/users \
-H "Authorization: Bearer <token>"
```

---

## **3. `updateUserHandler`**

### **Description**

This endpoint updates the details of the authenticated user.  
It validates the user's token, parses the request payload, and updates the user record in the database.

### **When to Use**

- To update user profile information such as name or other personal details.
- When the user edits their account settings.

### **Endpoint Details**

- **Method:** `PUT`
- **Path:** `/users`
- **Headers:**
  - `Authorization: Bearer <token>` (Required)

### **Request Payload**

```json
{
  "first_name": "John",
  "last_name": "Smith"
}
```

### **Response**

- **Success (200 OK):**

```json
{
  "success": true,
  "message": "User updated successfully"
}
```

- **Error Responses:**
  - `401 Unauthorized`: Token claims missing or invalid.
  - `400 Bad Request`: Invalid request body.
  - `500 Internal Server Error`: Failed to update user.

### **cURL Example**

```bash
curl -X PUT http://localhost:3010/api/users \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "first_name": "John",
  "last_name": "Smith"
}'
```
